/*!
 * $ Templates Plugin 1.0.4
 * https://github.com/KanbanSolutions/jquery-tmpl
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */
(function($, undefined) {
    var oldManip = $.fn.domManip,
        tmplItmAtt = "_tmplitem",
        newTmplItems = {},
        wrappedItems = {},
        appendToTmplItems, topTmplItem = {
            key: 0,
            data: {}
        },
        itemKey = 0,
        cloneIndex = 0,
        stack = [];
    var regex = {
        sq_escape: /([\\'])/g,
        sq_unescape: /\\'/g,
        dq_unescape: /\\\\/g,
        nl_strip: /[\r\t\n]/g,
        shortcut_replace: /\$\{([^\}]*)\}/g,
        lang_parse: /\{\%(\/?)(\w+|.)(?:\(((?:[^\%]|\%(?!\}))*?)?\))?(?:\s+(.*?)?)?(\(((?:[^\%]|\%(?!\}))*?)\))?\s*\%\}/g,
        old_lang_parse: /\{\{(\/?)(\w+|.)(?:\(((?:[^\}]|\}(?!\}))*?)?\))?(?:\s+(.*?)?)?(\(((?:[^\}]|\}(?!\}))*?)\))?\s*\}\}/g,
        template_anotate: /(<\w+)(?=[\s>])(?![^>]*_tmplitem)([^>]*)/g,
        text_only_template: /^\s*([^<\s][^<]*)?(<[\w\W]+>)([^>]*[^>\s])?\s*$/,
        html_expr: /^[^<]*(<[\w\W]+>)[^>]*$|\{\{\! |\{\%! /,
        last_word: /\w$/
    };

    function newTmplItem(options, parentItem, fn, data) {
        var newItem = {
            data: data || (data === 0 || data === false) ? data : (parentItem ? parentItem.data : {}),
            _wrap: parentItem ? parentItem._wrap : null,
            tmpl: null,
            parent: parentItem || null,
            nodes: [],
            calls: tiCalls,
            nest: tiNest,
            wrap: tiWrap,
            html: tiHtml,
            update: tiUpdate
        };
        if (options) {
            $.extend(newItem, options, {
                nodes: [],
                parent: parentItem
            });
        }
        if (fn) {
            newItem.tmpl = fn;
            newItem._ctnt = newItem._ctnt || $.isFunction(newItem.tmpl) && newItem.tmpl($, newItem) || fn;
            newItem.key = ++itemKey;
            (stack.length ? wrappedItems : newTmplItems)[itemKey] = newItem;
        }
        return newItem;
    }
    $.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(name, original) {
        $.fn[name] = function(selector) {
            var ret = [],
                insert = $(selector),
                elems, i, l, tmplItems, parent = this.length === 1 && this[0].parentNode;
            appendToTmplItems = newTmplItems || {};
            if (parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1) {
                insert[original](this[0]);
                ret = this;
            } else {
                for (i = 0, l = insert.length; i < l; i++) {
                    cloneIndex = i;
                    elems = (i > 0 ? this.clone(true) : this).get();
                    $(insert[i])[original](elems);
                    ret = ret.concat(elems);
                }
                cloneIndex = 0;
                ret = this.pushStack(ret, name, insert.selector);
            }
            tmplItems = appendToTmplItems;
            appendToTmplItems = null;
            $.tmpl.complete(tmplItems);
            return ret;
        };
    });
    $.fn.extend({
        tmpl: function(data, options, parentItem) {
            var ret = $.tmpl(this[0], data, options, parentItem);
            return ret;
        },
        tmplItem: function() {
            var ret = $.tmplItem(this[0]);
            return ret;
        },
        template: function(name) {
            var ret = $.template(name, this[0]);
            return ret;
        },
        domManip: function(args, table, callback, options) {
            if (args[0] && $.isArray(args[0])) {
                var dmArgs = $.makeArray(arguments),
                    elems = args[0],
                    elemsLength = elems.length,
                    i = 0,
                    tmplItem;
                while (i < elemsLength && !(tmplItem = $.data(elems[i++], "tmplItem"))) {}
                if (tmplItem && cloneIndex) {
                    dmArgs[2] = function(fragClone) {
                        $.tmpl.afterManip(this, fragClone, callback);
                    };
                }
                oldManip.apply(this, dmArgs);
            } else {
                oldManip.apply(this, arguments);
            }
            cloneIndex = 0;
            if (!appendToTmplItems) {
                $.tmpl.complete(newTmplItems);
            }
            return this;
        }
    });
    $.extend({
        tmpl: function(tmpl, data, options, parentItem) {
            var ret, topLevel = !parentItem;
            if (topLevel) {
                parentItem = topTmplItem;
                tmpl = $.template[tmpl] || $.template(null, tmpl);
                wrappedItems = {};
            } else if (!tmpl) {
                tmpl = parentItem.tmpl;
                newTmplItems[parentItem.key] = parentItem;
                parentItem.nodes = [];
                if (parentItem.wrapped) {
                    updateWrapped(parentItem, parentItem.wrapped);
                }
                return $(build(parentItem, null, parentItem.tmpl($, parentItem)));
            }
            if (!tmpl) {
                return [];
            }
            if (typeof data === "function") {
                data = data.call(parentItem || {});
            }
            if (options && options.wrapped) {
                updateWrapped(options, options.wrapped);
            }
            ret = $.isArray(data) ? $.map(data, function(dataItem) {
                return dataItem ? newTmplItem(options, parentItem, tmpl, dataItem) : null;
            }) : [newTmplItem(options, parentItem, tmpl, data)];
            return topLevel ? $(build(parentItem, null, ret)) : ret;
        },
        tmplItem: function(elem) {
            var tmplItem;
            if (elem instanceof $) {
                elem = elem[0];
            }
            while (elem && elem.nodeType === 1 && !(tmplItem = $.data(elem, "tmplItem")) && (elem = elem.parentNode)) {}
            return tmplItem || topTmplItem;
        },
        template: function(name, tmpl) {
            if (tmpl) {
                if (typeof tmpl === "string") {
                    tmpl = buildTmplFn(tmpl)
                } else if (tmpl instanceof $) {
                    tmpl = tmpl[0] || {};
                }
                if (tmpl.nodeType) {
                    tmpl = $.data(tmpl, "tmpl") || $.data(tmpl, "tmpl", buildTmplFn(tmpl.innerHTML));
                }
                return typeof name === "string" ? ($.template[name] = tmpl) : tmpl;
            }
            return name ? (typeof name !== "string" ? $.template(null, name) : ($.template[name] || $.template(null, name))) : null;
        },
        encode: function(text) {
            return ("" + text).split("<").join("&lt;").split(">").join("&gt;").split('"').join("&#34;").split("'").join("&#39;");
        }
    });
    $.extend($.tmpl, {
        tag: {
            "tmpl": {
                _default: {
                    $2: "null"
                },
                open: "if($notnull_1){__=__.concat($item.nest($1,$2));}"
            },
            "wrap": {
                _default: {
                    $2: "null"
                },
                open: "$item.calls(__,$1,$2);__=[];",
                close: "call=$item.calls();__=call._.concat($item.wrap(call,__));"
            },
            "each": {
                _default: {
                    $2: "$index, $value"
                },
                open: "if($notnull_1){$.each($1a,function($2){with(this){",
                close: "}});}"
            },
            "if": {
                open: "if(($notnull_1) && $1a){",
                close: "}"
            },
            "else": {
                open: "}else{"
            },
            "elif": {
                open: "}else if(($notnull_1) && $1a){"
            },
            "elseif": {
                open: "}else if(($notnull_1) && $1a){"
            },
            "html": {
                open: "if($notnull_1){__.push($1a);}"
            },
            "=": {
                _default: {
                    $1: "$data"
                },
                open: "if($notnull_1){__.push($.encode($1a));}"
            },
            "!": {
                open: ""
            }
        },
        complete: function(items) {
            newTmplItems = {};
        },
        afterManip: function afterManip(elem, fragClone, callback) {
            var content = fragClone.nodeType === 11 ? $.makeArray(fragClone.childNodes) : fragClone.nodeType === 1 ? [fragClone] : [];
            callback.call(elem, fragClone);
            storeTmplItems(content);
            cloneIndex++;
        }
    });

    function build(tmplItem, nested, content) {
        var frag, ret = content ? $.map(content, function(item) {
            return (typeof item === "string") ? (tmplItem.key ? item.replace(regex.template_anotate, "$1 " + tmplItmAtt + "=\"" + tmplItem.key + "\" $2") : item) : build(item, tmplItem, item._ctnt);
        }) : tmplItem;
        if (nested) {
            return ret;
        }
        ret = ret.join("");
        ret.replace(regex.text_only_template, function(all, before, middle, after) {
            frag = $(middle).get();
            storeTmplItems(frag);
            if (before) {
                frag = unencode(before).concat(frag);
            }
            if (after) {
                frag = frag.concat(unencode(after));
            }
        });
        return frag ? frag : unencode(ret);
    }

    function unencode(text) {
        var el = document.createElement("div");
        el.innerHTML = text;
        return $.makeArray(el.childNodes);
    }

    function buildTmplFn(markup) {
        var parse_tag = function(all, slash, type, fnargs, target, parens, args) {
            if (!type) {
                return "');__.push('";
            }
            var tag = $.tmpl.tag[type],
                def, expr, exprAutoFnDetect;
            if (!tag && window.console && console.group) {
                console.group("Exception");
                console.error(markup);
                console.error('Unknown tag: ', type);
                console.error(all);
                console.groupEnd("Exception");
            }
            if (!tag) {
                return "');__.push('";
            }
            def = tag._default || [];
            if (parens && !regex.last_word.test(target)) {
                target += parens;
                parens = "";
            }
            if (target) {
                target = unescape(target);
                args = args ? ("," + unescape(args) + ")") : (parens ? ")" : "");
                expr = parens ? (target.indexOf(".") > -1 ? target + unescape(parens) : ("(" + target + ").call($item" + args)) : target;
                exprAutoFnDetect = parens ? expr : "(typeof(" + target + ")==='function'?(" + target + ").call($item):(" + target + "))";
            } else {
                exprAutoFnDetect = expr = def.$1 || "null";
            }
            fnargs = unescape(fnargs);
            return "');" +
                tag[slash ? "close" : "open"].split("$notnull_1").join(target ? "typeof(" + target + ")!=='undefined' && (" + target + ")!=null" : "true").split("$1a").join(exprAutoFnDetect).split("$1").join(expr).split("$2").join(fnargs || def.$2 || "") +
                "__.push('";
        };
        var depreciated_parse = function() {
            if ($.tmpl.tag[arguments[2]]) {
                console.group("Depreciated");
                console.info(markup);
                console.info('Markup has old style indicators, use {% %} instead of {{ }}');
                console.info(arguments[0]);
                console.groupEnd("Depreciated");
                return parse_tag.apply(this, arguments);
            } else {
                return "');__.push('{{" + arguments[2] + "}}');__.push('";
            }
        };
        var parsed_markup_data = "var $=$,call,__=[],$data=$item.data; with($data){__.push('";
        var parsed_markup = $.trim(markup);
        parsed_markup = parsed_markup.replace(regex.sq_escape, "\\$1");
        parsed_markup = parsed_markup.replace(regex.nl_strip, " ");
        parsed_markup = parsed_markup.replace(regex.shortcut_replace, "{%= $1%}");
        parsed_markup = parsed_markup.replace(regex.lang_parse, parse_tag);
        parsed_markup = parsed_markup.replace(regex.old_lang_parse, depreciated_parse);
        parsed_markup_data += parsed_markup;
        parsed_markup_data += "');}return __;";
        return new Function("$", "$item", parsed_markup_data);
    }

    function updateWrapped(options, wrapped) {
        options._wrap = build(options, true, $.isArray(wrapped) ? wrapped : [regex.html_expr.test(wrapped) ? wrapped : $(wrapped).html()]).join("");
    }

    function unescape(args) {
        return args ? args.replace(regex.sq_unescape, "'").replace(regex.dq_unescape, "\\") : null;
    }

    function outerHtml(elem) {
        var div = document.createElement("div");
        div.appendChild(elem.cloneNode(true));
        return div.innerHTML;
    }

    function storeTmplItems(content) {
        var keySuffix = "_" + cloneIndex,
            elem, elems, newClonedItems = {},
            i, l, m;
        for (i = 0, l = content.length; i < l; i++) {
            if ((elem = content[i]).nodeType !== 1) {
                continue;
            }
            elems = elem.getElementsByTagName("*");
            for (m = elems.length - 1; m >= 0; m--) {
                processItemKey(elems[m]);
            }
            processItemKey(elem);
        }

        function processItemKey(el) {
            var pntKey, pntNode = el,
                pntItem, tmplItem, key;
            if ((key = el.getAttribute(tmplItmAtt))) {
                while (pntNode.parentNode && (pntNode = pntNode.parentNode).nodeType === 1 && !(pntKey = pntNode.getAttribute(tmplItmAtt))) {}
                if (pntKey !== key) {
                    pntNode = pntNode.parentNode ? (pntNode.nodeType === 11 ? 0 : (pntNode.getAttribute(tmplItmAtt) || 0)) : 0;
                    if (!(tmplItem = newTmplItems[key])) {
                        tmplItem = wrappedItems[key];
                        tmplItem = newTmplItem(tmplItem, newTmplItems[pntNode] || wrappedItems[pntNode]);
                        tmplItem.key = ++itemKey;
                        newTmplItems[itemKey] = tmplItem;
                    }
                    if (cloneIndex) {
                        cloneTmplItem(key);
                    }
                }
                el.removeAttribute(tmplItmAtt);
            } else if (cloneIndex && (tmplItem = $.data(el, "tmplItem"))) {
                cloneTmplItem(tmplItem.key);
                newTmplItems[tmplItem.key] = tmplItem;
                pntNode = $.data(el.parentNode, "tmplItem");
                pntNode = pntNode ? pntNode.key : 0;
            }
            if (tmplItem) {
                pntItem = tmplItem;
                while (pntItem && pntItem.key != pntNode) {
                    pntItem.nodes.push(el);
                    pntItem = pntItem.parent;
                }
                delete tmplItem._ctnt;
                delete tmplItem._wrap;
                $.data(el, "tmplItem", tmplItem);
            }

            function cloneTmplItem(key) {
                key = key + keySuffix;
                tmplItem = newClonedItems[key] = (newClonedItems[key] || newTmplItem(tmplItem, newTmplItems[tmplItem.parent.key + keySuffix] || tmplItem.parent));
            }
        }
    }

    function tiCalls(content, tmpl, data, options) {
        if (!content) {
            return stack.pop();
        }
        stack.push({
            _: content,
            tmpl: tmpl,
            item: this,
            data: data,
            options: options
        });
    }

    function tiNest(tmpl, data, options) {
        return $.tmpl($.template(tmpl), data, options, this);
    }

    function tiWrap(call, wrapped) {
        var options = call.options || {};
        options.wrapped = wrapped;
        return $.tmpl($.template(call.tmpl), call.data, options, call.item);
    }

    function tiHtml(filter, textOnly) {
        var wrapped = this._wrap;
        return $.map($($.isArray(wrapped) ? wrapped.join("") : wrapped).filter(filter || "*"), function(e) {
            return textOnly ? e.innerText || e.textContent : e.outerHTML || outerHtml(e);
        });
    }

    function tiUpdate() {
        var coll = this.nodes;
        $.tmpl(null, null, null, this).insertBefore(coll[0]);
        $(coll).remove();
    }
})(jQuery);