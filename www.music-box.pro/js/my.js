(function($) {
    var sip = "";
    var refferLogin = "";
    $.my = {
        init: function() {
            $.my.dispatch(window.location.hash);
            $(window).bind('hashchange', function() {
                lastTime = 30;
                var hash = window.location.hash;
                $.my.dispatch(hash);
            });
        },
        dispatch: function(hash) {
            if (hash) {
                hash = hash.split('/');
                if (hash[1]) {
                    var actionName = hash[1];
                    var attr = hash[2];
                    if (this[actionName + 'Action']) {
                        this.currentAction = actionName;
                        this.currentActionAttr = attr;
                        this[actionName + 'Action'](hash[2], hash[3]);
                    } else {
                        if (console) {
                            console.log('Invalid action name:', actionName + 'Action');
                        }
                    }
                } else {
                    this.defaultAction();
                }
            } else {
                this.defaultAction();
            }
            $("ul.user-nav li").removeClass('current-menu-item');
            $("div#mousemove-logo").show();
            if (actionName) {
                var a = $(".user-nav li a[href='#/" + actionName + "/']");
                a.parent().addClass('current-menu-item');
            } else {
                var a = $(".user-nav li a[href='#/']");
                a.parent().addClass('current-menu-item');
            }
        },
        defaultAction: function() {
            this.ipinfo();
            $(".main-content.clearfix").load('/my/home/', function() {});
        },
        categoriesAction: function() {
            $(".main-content.clearfix").load('/my/categories/', function() {});
        },
        accountAction: function() {
            $(".main-content.clearfix").load('/my/account/', function() {});
        },
        referralAction: function() {
            $(".main-content.clearfix").load('/my/referral/', function() {});
        },
        historyAction: function() {
            $(".main-content.clearfix").load('/my/history/', function() {});
        },
        promotionAction: function() {
            $(".main-content.clearfix").load('/my/promotion/', function() {});
        },
        promotionEditAction: function(id) {
            $(".main-content.clearfix").load('/my/promotionEdit/', {
                "id": id
            }, function() {});
        },
        mediaAction: function() {
            $(".main-content.clearfix").load('/my/media/', function() {});
        },
        outputAction: function() {
            $(".main-content.clearfix").load('/mine/output/', function() {});
        },
        inputAction: function() {
            $(".main-content.clearfix").load('/mine/input/', function() {});
        },
        phoneAction: function() {
            $(".main-content.clearfix").load('/my/phone/', function() {});
        },
        autoplayAction: function() {
            $(".main-content.clearfix").load('/my/autoplay/', function() {});
        },
        newbieAction: function() {
            $(".main-content.clearfix").load('/my/newbie/', function() {});
        },
        downloadTrek: function() {
            $.post("/my/downloadTrek/", function(response) {
                modalStart("Скачивание трека с проекта", response);
            });
        },
        videoAction: function() {
            $(".main-content.clearfix").load('/my/video/', function() {});
        },
        photoAction: function() {
            $(".main-content.clearfix").load('/mine/photo/', function() {});
        },
        bankAction: function() {
            $(".main-content.clearfix").load('/my/bank/', function() {});
        },
        cartAction: function() {
            $(".main-content.clearfix").load('/my/cart/', function() {});
        },
        sms_sendingAction: function() {
            $(".main-content.clearfix").load('/my/sms_sending/', function() {});
        },
        widgetAction: function() {
            $(".main-content.clearfix").load('/mine/widget/');
        },
        premiumAction: function() {
            $(".main-content.clearfix").load('/mine/premium/');
        },
        bitcoinAction: function() {
            $(".main-content.clearfix").load('/mine/bitcoin/');
        },
        covid19Action: function() {
            $(".main-content.clearfix").load('/mine/covid19/');
        },
        musicBoxAction: function() {
            $(".main-content.clearfix").load('/mine/music-box/');
        },
        bestTrackAction: function() {
            $(".main-content.clearfix").load('/mine/bestTrack/', function() {});
        },
        bonusAction: function() {
            $(".main-content.clearfix").load('/mine/bonus/', function() {});
        },
        ratingAction: function() {
            $(".main-content.clearfix").load('/mine/rating/', function() {});
        },
        messages_administrator: function(id) {
            $.post("/my/messages_administrator/", {
                "id": id
            }, function(response) {
                if (response != '') {
                    $('#modal_messages').modal({
                        keyboard: false,
                        backdrop: 'static',
                        show: true,
                    });
                    $("#modal_messages .caption").text("Сообщение от администратора");
                    $("#modal_messages .modal-text").html('<p>' + response + '</p>');
                }
            });
        },
        giftAction: function() {
            $(".main-content.clearfix").load('/mine/gift/', function() {});
        },
        noteAction: function() {
            $(".main-content.clearfix").load('/mine/note/');
        },
        ipinfo: function() {
            if (sip == "stop") return;
            sip = "stop";
            $.post("/mine/ipinfo/", function(response) {
                if (response.status == "ok") {
                    $('#modal_messages').modal({
                        keyboard: false,
                        backdrop: 'static',
                        show: true,
                    });
                    html = '<br><a id="ipinfo" href="/mine/ipinfo/url/?v=' + Math.floor((Math.random() * 1000) + 1) + '" target="_blanck" class="btn btn-default btn-green btn-big" style="margin: 0 auto;display: inherit;width: 200px;text-align: center;">';
                    html = html + ' ' + response.data.title_a + '</a>';
                    $("#modal_messages .caption").text(response.data.title);
                    $("#modal_messages .modal-text").html('<p>' + response.data.description + ' ' + html + '</p>');
                }
            }, "json");
        },
        messages_meloman: function(login) {
            refferLogin = login;
            $.post("/mine/messages_meloman/", function(response) {
                if (response != '') {
                    $('#modal_messages').modal({
                        keyboard: false,
                        backdrop: 'static',
                        show: true,
                    });
                    $("#modal_messages .caption").text("СООБЩЕНИЕ ОТ " + refferLogin);
                    $("#modal_messages .modal-text").html('<p>' + response + '</p>');
                }
            });
        }
    }
    $(document).on("click", "ul.user-nav li a", function(event) {
        scroling_w = 300;
        if (document.body.clientWidth < 768) {
            scroling_w = 100;
        }
        var destination = $(".main-content").offset().top - scroling_w;
        jQuery("html:not(:animated),body:not(:animated)").animate({
            scrollTop: destination
        }, 1000);
    });
    $(document).on("click", "div.balance-btns a", function(event) {
        scroling_w = 300;
        if (document.body.clientWidth < 768) {
            scroling_w = 100;
        }
        var destination = $(".main-content").offset().top - scroling_w;
        jQuery("html:not(:animated),body:not(:animated)").animate({
            scrollTop: destination
        }, 1000);
    });
    $(document).on("click", "a#ipinfo", function(event) {
        $('#modal_messages').modal("hide");
    });
    $(document).on("submit", "form#pay-inputpost-new", function(event) {
        var price = $("input[name='price']").val();
        var pay_system = $("input[name='pay_system']").val();
        if (pay_system == "free-kassa" && price < 500) {
            modalStart("Пополнение баланса", "Минимальная сумма пополнение через Free-Kassa 500 руб*");
            return false;
        }
        if (pay_system == "anypay" && price < 10) {
            modalStart("Пополнение баланса", "Минимальная сумма пополнение через VISA / MasterCard 10 руб*");
            return false;
        }
        if (pay_system == "free_kassa_visa_api" && price < 100) {
            modalStart("Пополнение баланса", "Минимальная сумма пополнение через VISA / MasterCard 100 руб*");
            return false;
        }
        if (pay_system == "free_kassa_visa_api" && price > 45000) {
            modalStart("Пополнение баланса", "Максимальная сумма пополнение через VISA / MasterCard 45000 руб*");
            return false;
        }
        if (pay_system == "payok" && price < 10) {
            modalStart("Пополнение баланса", "Минимальная сумма пополнение через VISA / MasterCard 10 руб*");
            return false;
        }
        if (pay_system == "payok" && price > 45000) {
            modalStart("Пополнение баланса", "Максимальная сумма пополнение через VISA / MasterCard 45000 руб*");
            return false;
        }
        if (price > 0) {
            if (pay_system == "free_kassa_visa_api") {
                $("#followingBallsG").show();
            }
            $(".main-content.clearfix").load('/mine/input/post/', $(this).serialize());
        } else {
            modalStart("Пополнение баланса", "Введите сумму для пополнение Вашего баланса*");
        }
        return false;
    });
    $(document).on("keydown", "input[name='price']", function(event) {
        var form = $(this).parents('form:first');
        if (event.which == 13) {
            $('input[type="submit"]', form).click();
        }
        if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || (event.keyCode == 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39) || (event.keyCode == 188 || event.keyCode == 190 || event.keyCode == 108 || event.keyCode == 110)) {
            return;
        } else {
            if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                event.preventDefault();
            }
        }
    });
    $(document).on("keyup", "input[name='code']", function(event) {
        $(this).val($(this).val().replace(/\D/, ''));
    });
    $(document).on("click", "a#messages_administrator-thank", function(event) {
        var id = $(this).data("id");
        $.post("/my/messages_administratorEdit/", {
            'id': id,
            "status": "thank"
        }, function(response) {
            if (response.status == 'ok') {
                $('#modal_messages').modal("hide");
                document.getElementById('myIdpleerPley').src += '';
            }
        }, "json");
        return false;
    });
    $(document).on("submit", "form#messages_administrator-submit", function(event) {
        $.post("/my/messages_administratorEdit/", $(this).serialize(), function(response) {
            if (response.status == 'ok') {
                $('#modal_messages').modal("hide");
                modalStart("СООБЩЕНИЕ ОТ АДМИНИСТРАТОРА", "Ваше сообщение успешно отправлено администратору*");
                document.getElementById('myIdpleerPley').src += '';
            } else if (response.status == 'error') {
                $("p#messages_administrator-error").html(response.data);
            }
        }, "json");
        return false;
    });
    $(document).on("click", "a#messages_meloman-close", function(event) {
        var id = $(this).data("id");
        $.post("/messages_meloman/close/", function(response) {
            $('#modal_messages').modal("hide");
            document.getElementById('myIdpleerPley').src += '';
        });
        return false;
    });
    $(document).on("submit", "form#messages_meloman-submit", function(event) {
        $.post("/messages_meloman/submit/", $(this).serialize(), function(response) {
            if (response.status == 'ok') {
                $('#modal_messages').modal("hide");
                modalStart("СООБЩЕНИЕ " + refferLogin, "Ваше сообщение успешно отправлено рефереру*");
                document.getElementById('myIdpleerPley').src += '';
            } else if (response.status == 'error') {
                $("p#messages_meloman-error").html(response.data);
            }
        }, "json");
        return false;
    });
    $(document).on("click", "#note-change", function(event) {
        $div = $(this);
        $.post("/note/buy/", function(response) {
            if (response.status == "error") {
                modalStart("Золотая нота", response.data);
                $.my.noteAction();
            }
            if (response.status == "ok") {
                modalStart("Золотая нота", response.data);
                $.my.noteAction();
            }
        }, "json");
        return false;
    });
    $(document).on("click", "#premium-change", function(event) {
        $div = $(this);
        $.post("/premium/buy/", function(response) {
            if (response.status == "error") {
                modalStart("PREMIUM аккаунт", response.data);
                $.my.premiumAction();
            }
            if (response.status == "ok") {
                modalStart("Premium аккаунт", response.data);
                $.my.premiumAction();
            }
        }, "json");
        return false;
    });
    $(document).on("click", "#covid19-change", function(event) {
        $div = $(this);
        $.post("/covid19/buy/", function(response) {
            if (response.status == "error") {
                modalStart("COVID-19", response.data);
            }
            if (response.status == "ok") {
                modalStart("COVID-19", response.data);
                $("#covid19-change").hide();
            }
        }, "json");
        return false;
    });
    $(document).on("submit", "form#phone-seve", function(event) {
        $.post("/my/phoneSeve/", $(this).serialize(), function(response) {
            if (response.status == 'ok') {
                if (response.param == "code") {
                    modalStart("Подтверждение телефона", "Вам отправлен код подтверждения по SMS! Время доставки до 3 мин*");
                    $("#phone").attr({
                        "disabled": "disabled"
                    });
                    $("#code").show();
                    $("#code").focus();
                    $("#phone-seve input[type='submit']").val('Подтвердить');
                } else if (response.param == "good") {
                    var hash = "#/output/";
                    window.location.hash = hash;
                    $.my.dispatch(hash);
                    modalStart("Подтверждение телефона", response.data);
                }
            } else if (response.status == 'error') {
                modalStart("Подтверждение телефона", response.data);
            }
        }, "json");
        return false;
    });
    $(document).on("click", "a#phone-change", function(event) {
        $.post("/my/phoneSeve/", {
            'change': 1
        }, function(response) {
            if (response.status == 'ok') {
                modalStart("Подтверждение телефона", "Вы можете изменить свой номер телефона*");
                var hash = window.location.hash;
                $.my.dispatch(hash);
            }
        }, "json");
        return false;
    })
    $(document).on("click", "div#sms_sending-change", function(event) {
        var id = $(this).data("id");
        $.post("/my/sms_sending_change/", {
            'id': id
        }, function(response) {
            modalStart("SMS рассылка на телефон", response);
            $("#modal_example .modal-footer-end").hide();
        });
        return false;
    })
    $(document).on("click", "div#sms_sending-send", function(event) {
        var id = $(this).data("id");
        var description = $("#description-sending").val();
        $.post("/my/sms_sending_send/", {
            'id': id,
            "description": description
        }, function(response) {
            modalStart("SMS рассылка на телефон", response);
            $("#modal_example .modal-footer-end").show();
        });
        return false;
    });
    $(document).on("click", "a#sms_sendingHistory", function(event) {
        var id = $(this).data("id");
        $.post("/my/sms_sending_History/", {
            'id': id
        }, function(response) {
            modalStart("SMS рассылка на телефон", response);
        });
        return false;
    })
    $(document).on("submit", "form#output", function(event) {
        $.post("/mine/output/save/", $(this).serialize(), function(response) {
            if (response.status == 'ok') {
                modalStart("Вывод средств", response.data);
                if (response.verified_phone == 1) {
                    var hash = window.location.hash;
                    $.my.dispatch(hash);
                } else {
                    var hash = "#/phone/";
                    window.location.hash = hash;
                    $.my.dispatch(hash);
                }
            } else if (response.status == 'error') {
                modalStart("Вывод средств", response.data);
            } else if (response.status == 'pin_code') {
                var hash = window.location.hash;
                $.my.dispatch(hash);
            }
        }, "json");
        return false;
    });
    $(document).on("click", ".selectable", function(event) {
        var param = $(this).data('content');
        $("#pay_system").val(param);
        $('.selectable').removeClass('selected');
        $(this).addClass('selected');
    });
    $(document).on("submit", "form#pin-code", function(event) {
        $.post("/mine/output/pin/", $(this).serialize(), function(response) {
            if (response.status == 'ok') {
                var hash = window.location.hash;
                $.my.dispatch(hash);
            } else {
                modalStart("Вывод средств", 'PIN-код введен неверно*');
                if (response.status == 'pin-code-error') {
                    var hash = window.location.hash;
                    $.my.dispatch(hash);
                }
            }
        }, "json");
        return false;
    });
    $(document).on("click", "#delete-promotion", function(event) {
        var id = $(this).data("id");
        if (confirm("Точно удалить?")) {
            $.post("/my/promotionDelete/", {
                'id': id
            }, function(response) {
                modalStart("Реклама на сайте", "Реклама успешно удалена*");
                setTimeout(function() {
                    var hash = window.location.hash;
                    $.my.dispatch(hash);
                }, 1000);
            }, "json");
        }
        return false;
    });
    $(document).on("click", "#prolong-promotion", function(event) {
        var id = $(this).data("id");
        $.post("/my/promotionProlong/", {
            'id': id
        }, function(response) {
            modalStart("Реклама на сайте", response);
        });
        return false;
    });
    $(document).on("submit", "form#promotion-update-price", function(event) {
        $.post("/my/promotionProlongSave/", $(this).serialize(), function(response) {
            modalStart("Реклама на сайте", response.data);
            var hash = window.location.hash;
            $.my.dispatch(hash);
        });
        return false;
    });
    $(document).on("click", "#reset-statistics", function(event) {
        var id = $(this).data("id");
        if (confirm("Точно обнулить?")) {
            $.post("/my/promotionStatisticsReset/", {
                'id': id
            }, function(response) {
                modalStart("Реклама на сайте", "Статистика успешно обнулена*");
                var hash = window.location.hash;
                $.my.dispatch(hash);
            }, "json");
        }
        return false;
    });
    $(document).on("submit", "form#account-form", function(event) {
        $("form#account-form .form-row input[type='text']").css("border", "");
        $("#form-login-valid").hide();
        $.post("/my/accountSave/", $(this).serialize(), function(response) {
            if (response.status == 'ok') {
                var hash = window.location.hash;
                $.my.dispatch(hash);
            } else if (response.status == 'error') {
                if (response.date) {
                    response.date.forEach(function(item) {
                        if (item == "login") {
                            $("#form-login-valid").show(220);
                        }
                        if (item == "login-esc") {
                            $("#form-login-esc").show(220);
                            item = login;
                        }
                        var a = $("form#account-form .form-row input[name='" + item + "']");
                        a.css("border", "1px solid #f83148");
                    })
                }
            }
        }, "json");
        return false;
    });
    $(document).on("submit", "form#password-form-save", function(event) {
        $("form#password-form-save input[type='text']").css("border", "");
        $("form#password-form-save span.messages").html("");
        $.post("/my/accountPassSave/", $(this).serialize(), function(response) {
            if (response.status == 'ok') {
                var hash = window.location.hash;
                $.my.dispatch(hash);
                modalStart("Личные данные", "Пароль успешно изменен*");
            } else if (response.status == 'error') {
                if (response.date) {
                    response.date.forEach(function(item) {
                        var a = $("form#password-form-save input[name='" + item + "']");
                        a.css("border", "1px solid #f83148");
                    });
                }
                if (response.messages) {
                    for (var key in response.messages) {
                        $("form#password-form-save span.messages." + key).html(response.messages[key]);
                    }
                }
            }
        }, "json");
        return false;
    });
    $(document).on("click", "#categories-change", function(event) {
        var categories_id = $(this).data("id");
        var t = $(this);
        $.post("/my/categoriesChange/", {
            'categories_id': categories_id
        }, function(response) {
            if (response.status == 'ok') {
                $(".table-categories tr").removeClass("current-cat");
                $(".balance-block .value strong").text(response.money);
                modalStart("Категории для заработка", "Поздравляем! Вы успешно активировали категорию*");
                $(t).parents("tr").addClass("current-cat");
                $(t).parents("td").html('<div class="status-active"><i class="icon icon-green-tick"></i> <span>Активно</span></div>');
            } else if (response.status == 'error') {
                if (response.data == "money") {
                    modalStart("Категории для заработка", "У Вас недостаточно бит на балансе для активации данной категории! Пожалуйста пополните свой баланс*");
                } else if (response.data == "not") {
                    modalStart("Категории для заработка", "Категория Вам недоступна*");
                } else if (response.data == "cat_false") {
                    modalStart("Категории для заработка", "Вы уже активировали данную категорию*");
                }
            }
        }, "json");
        return false;
    })
    $(document).on("click", "#autoplay-change", function(event) {
        $div = $(this);
        $.post("/my/autoplayChange/", function(response) {
            if (response.status == "error") {
                if (response.data == "money") {
                    modalStart("АВТОПЛЕЕР", "У Вас недостаточно бит на балансе! Пожалуйста пополните свой баланс*");
                } else {
                    modalStart("АВТОПЛЕЕР", "Вы уже активировали АВТОПЛЕЕР*");
                }
            }
            if (response.status == "ok") {
                $div.hide(200);
                modalStart("АВТОПЛЕЕР", "Вы успешно активировали услугу АВТОПЛЕЕР*");
            }
        }, "json");
        return false;
    });
    $(document).on("click", "#newbie-change", function(event) {
        $div = $(this);
        $.post("/my/newbieChange/", function(response) {
            if (response.status == "error") {
                if (response.data == "money") {
                    modalStart("VIP-НОВИЧОК", "У Вас недостаточно бит на балансе! Пожалуйста пополните свой баланс*");
                } else {
                    modalStart("VIP-НОВИЧОК", "Вы уже активировали VIP-НОВИЧОК*");
                }
            }
            if (response.status == "ok") {
                $div.hide(200);
                modalStart("VIP-НОВИЧОК", "Вы успешно активировали статус VIP-НОВИЧОК*");
            }
        }, "json");
        return false;
    });
    $(document).on("click", "#photo-change", function(event) {
        $div = $(this);
        $.post("/mine/photo/photoChange/", function(response) {
            modalStart("Заработок на фото", response);
        });
        return false;
    });
    $(document).on("click", "#video-change", function(event) {
        $div = $(this);
        $.post("/my/videoChange/", function(response) {
            modalStart("Заработок на видео", response);
        });
        return false;
    });
    $(document).on("click", "#video-like", function(event) {
        $div = $(this);
        $.post("/my/videoLike/", function(response) {
            if (response.status == "ok") {
                $div.hide(200);
                modalStart("Заработок на видео", response);
            }
        }, "json");
        return false;
    });
    $(document).on("click", "#bestTrack-change", function(event) {
        $div = $(this);
        $.post("/mine/bestTrack/start/", function(response) {
            modalStart("Лучший трек дня", response);
        });
        return false;
    });
    $(document).on("change", "input[name='promo']", function(event) {
        $(".tabs .promo-text").toggle(400);
        $(".tabs .promo-bnr").toggle(400);
        $(".out-section-block .form-row label.item").removeClass('selected');
        $this = $(this);
        $label = $('label[for="' + $this.attr('id') + '"]');
        $label.addClass('selected');
    });
    $(document).on("click", "#cart-change", function(event) {
        var id = $(this).data("id");
        $.post("/my/cartChange/", {
            "id": id
        }, function(response) {
            modalStart("Магазин рефералов", response.data);
        });
        return false;
    });
    $(document).on("click", "#bitcoin-change", function(event) {
        money = $("input[name='bitcoin_price']").val();
        $.post("/mine/bitcoin/buying/", {
            "money": money
        }, function(response) {
            if (response.status == "error") {
                modalStart("Заработок на Bitcoin", response.data);
            }
            if (response.status == "ok") {
                var hash = window.location.hash;
                $.my.dispatch(hash);
                modalStart("Заработок на Bitcoin", "Вы успешно купили Bitcoin*");
            }
        }, "json");
        return false;
    });
    $(document).on("click", "#bitcoin-sell", function(event) {
        money = $("input[name='bitcoin_price_sell']").val();
        $.post("/mine/bitcoin/sell/", {
            "money": money
        }, function(response) {
            if (response.status == "error") {
                modalStart("Заработок на Bitcoin", response.data);
            }
            if (response.status == "ok") {
                var hash = window.location.hash;
                $.my.dispatch(hash);
                modalStart("Заработок на Bitcoin", "Вы успешно подали заявку на продажу Bitcoin*");
            }
        }, "json");
        return false;
    });
    $(document).on("keyup", ".promo-text input[name='title']", function(event) {
        $("#previewTitle").text($(this).val());
    });
    $(document).on("keyup", ".promo-text textarea[name='content']", function(event) {
        $("#previewText").text($(this).val());
    });
    $(document).on("click", ".checkbox", function(event) {
        if ($('input#pink_yes:checked').prop('checked')) {
            $('input#pink_yes').prop('checked', false);
            $(this).removeClass('selected');
            $('#previewTitle').css('color', "#000");
        } else {
            $('input#pink_yes').prop('checked', true);
            $(this).addClass('selected');
        }
    });
    $(document).on("click", ".colors-radio .item", function(event) {
        var color = $(this).data('color');
        if ($('input#pink_yes:checked').prop('checked')) {} else {
            $('input#pink_yes').prop('checked', true);
            $(".adv-form .checkbox").addClass('selected');
        }
        $(".colors-radio .item").removeClass('selected');
        $(this).toggleClass('selected');
        $('#previewTitle').css({
            'color': color
        });
        $("input#color").val(color);
    });
    $(document).on("submit", "form#promotion-save", function(e) {
        modalStart("Реклама на сайте", "Пожалуйста, подождите! Идет загрузка Вашей рекламы*");
        $('#promotion-save .btn-default').hide();
        $.ajax({
            url: "/my/promotionSave/",
            type: "POST",
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData: false,
            success: function(response) {
                $('#promotion-save .btn-default').show();
                if (response.status == 'ok') {
                    modalStart("Реклама на сайте", "Объявление успешно сохранено и отправлено на модерацию*");
                    var hash = window.location.hash;
                    $.my.dispatch(hash);
                } else if (response.status == 'error') {
                    modalStart("Ошибка", response.data);
                }
            }
        });
        return false;
    });
    $(document).on("submit", "form#promotion-save-id", function(e) {
        $.ajax({
            url: "/my/promotionSaveId/",
            type: "POST",
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData: false,
            success: function(response) {
                if (response.status == 'ok') {
                    modalStart("Реклама на сайте", "Объявление успешно сохранено и отправлено на модерацию*");
                    var hash = window.location.hash = "#/promotion/";
                    $.my.dispatch(hash);
                } else if (response.status == 'error') {
                    modalStart("Ошибка", response.data);
                }
            }
        });
        return false;
    });
    $(document).on("submit", "form#widget-save", function(event) {
        $.post("/mine/widget/save/", $(this).serialize(), function(response) {
            if (response.status == 'ok') {
                modalStart("Аудиоплеер на Вашем сайте", "Заявка успешно отправлена на модерацию*");
                var hash = window.location.hash = "#/widget/";
                $.my.dispatch(hash);
            } else if (response.status == 'error') {
                modalStart("Ошибка", response.data);
            }
        }, "json");
        return false;
    });
    $(document).on("change", "input#imgInput", function(event) {
        readURL(this);
    });
    $(document).on("click", "#delete-media", function(event) {
        var id = $(this).data("id");
        if (confirm("Точно удалить?")) {
            $.post("/my/mediaDelete/", {
                'id': id
            }, function(response) {
                modalStart("Обладателям медиа", "Трек успешно удален*");
                setTimeout(function() {
                    var hash = window.location.hash;
                    $.my.dispatch(hash);
                }, 1000);
            }, "json");
        }
        return false;
    });
    $(document).on("click", "#prolong-media", function(event) {
        var id = $(this).data("id");
        $.post("/my/mediaProlong/", {
            'id': id
        }, function(response) {
            modalStart("Обладателям медиа", response);
        });
        return false;
    });
    $(document).on("submit", "form#media-update-price", function(event) {
        $.post("/my/mediaProlongSave/", $(this).serialize(), function(response) {
            modalStart("Обладателям медиа", response.data);
            var hash = window.location.hash;
            $.my.dispatch(hash);
        });
        return false;
    });
    $(document).on("click", "#downloaddiv .checkbox", function(event) {
        if ($('input#download:checked').prop('checked')) {
            $('input#download').prop('checked', false);
            $(this).removeClass('selected');
            $('#previewTitle').css('color', "#000");
        } else {
            $('input#download').prop('checked', true);
            $(this).addClass('selected');
        }
    });
    $(document).on("click", ".colors-radio .item", function(event) {
        var color = $(this).data('color');
        if ($('input#download:checked').prop('checked')) {} else {
            $('input#download').prop('checked', true);
            $(".adv-form .checkbox").addClass('selected');
        }
        $(".colors-radio .item").removeClass('selected');
        $(this).toggleClass('selected');
    });
    $(document).on("click", "#mednamediv .checkbox", function(event) {
        if ($('input#medname:checked').prop('checked')) {
            $('input#medname').prop('checked', false);
            $(this).removeClass('selected');
            $('#previewTitle').css('color', "#000");
        } else {
            $('input#medname').prop('checked', true);
            $(this).addClass('selected');
        }
    });
    $(document).on("click", "#mednamediv .colors-radio .item", function(event) {
        var color = $(this).data('color');
        if ($('input#medname:checked').prop('checked')) {} else {
            $('input#medname').prop('checked', true);
            $(".adv-form .checkbox").addClass('selected');
        }
        $(".colors-radio .item").removeClass('selected');
        $(this).toggleClass('selected');
    });
    $(document).on("submit", "form#media-save", function(e) {
        $.ajax({
            url: "/my/mediaSave/",
            type: "POST",
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData: false,
            success: function(response) {
                if (response.status == 'ok') {
                    modalStart("Обладателям медиа", "Трек успешно добавлен и отправлен на модерацию*");
                    var hash = window.location.hash;
                    $.my.dispatch(hash);
                } else if (response.status == 'error') {
                    modalStart("Ошибка", response.data);
                }
            }
        });
        return false;
    });
    $(document).on("click", "#reset-media-statistics", function(event) {
        var id = $(this).data("id");
        if (confirm("Точно обнулить?")) {
            $.post("/my/mediaStatisticsReset/", {
                'id': id
            }, function(response) {
                modalStart("Реклама на сайте", "Статистика успешно обнулена*");
                var hash = window.location.hash;
                $.my.dispatch(hash);
            }, "json");
        }
        return false;
    });
    $(document).on("click", "a#downloadBitArt", function(event) {
        var r = $(this);
        $.post("/my/downloadBit/", function(response) {
            if (response.status == "ok") {
                document.getElementById("downloadBit").click()
                $('#modal_example').modal('hide');
                return true;
            } else {
                modalStart("Ошибка", response.data);
                return false;
            }
        }, "json");
    });
    $(document).ajaxComplete(function(event, xhr, settings) {
        if (xhr.getResponseHeader('REQUIRES_AUTH') === '1') {
            window.location = '/';
        }
        if (settings.url == "/my/mymoney/" || settings.url == "/my/home/" || settings.url == "/mine/ipinfo/" || settings.url == "/covid19/buy/") {} else {
            $.post("/my/mymoney/", function(response) {
                if (response.status == 'ok') {
                    $(".balance-block .value strong").text(response.money);
                }
            });
            return false;
        }
    });
    $(document).on("click", "div#bank-change", function(event) {
        div = $(this).parents("tr");
        money = div.find('.bank-input').val();
        tarif = $(this).data("id");
        $.post("/my/bankChange/", {
            'money': money,
            "tarif": tarif
        }, function(response) {
            if (response.status == "ok") {
                var hash = window.location.hash;
                $.my.dispatch(hash);
            }
            modalStart("Мой сейф", response.data);
        }, "json");
    });
    $(document).on("click", "#music-box-change", function(event) {
        form = $(this).parents("form");
        $.post("/mine/music-box/start/", form.serialize(), function(response) {
            if (response.status == 'error') {
                modalStart("Музыкальная шкатулка", response.data);
            } else {
                $(".main-content.clearfix").html(response);
            }
        });
        return false;
    });

    function modalStart(title, data) {
        $('#modal_example .modal-footer-end').show();
        $('#modal_example').modal({
            backdrop: true,
            keyboard: true,
            show: true
        });
        $("#modal_example .caption").text(title);
        $("#modal_example .modal-text").html('<p>' + data + '</p>');
    }

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#image-banner').attr('src', e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    function secToTime(sec) {
        dt = new Date();
        dt.setTime(sec * 1000);
        s = dt.getUTCSeconds();
        if (s < 10) {
            s = "0" + s;
        }
        h = dt.getUTCMinutes();
        if (h < 10) {
            h = "0" + h;
        }
        return "00:" + h + ":" + s;
    }
    var lastTime = 31;
    setInterval(function() {
        if (lastTime > 30) {
            if ($("div").is(".banners-block")) {
                lastTime = -1;
                $("div.banners-block").load('/my/promotionAll/');
            }
        } else {
            lastTime = lastTime + 3;
        }
    }, 3000);
    window.addEventListener("message", function(e) {
        if (e.data) {
            if (e.data == "musicBox") {
                $.post("/mine/music-box/end/", function(response) {
                    if (response.status == 'ok') {
                        modalStart("Музыкальная шкатулка", response.data);
                    } else if (response.status == 'error') {
                        modalStart("Музыкальная шкатулка", response.data);
                    }
                    var hash = window.location.hash = "#/musicBox/";
                    $.my.dispatch(hash);
                });
            }
        }
    }, false);
    var debug = false;
    $.params = {
        init: function() {
            debug = false;
        },
        debug_true: function() {
            debug = true;
            console.log("Режим отладки включен");
        },
        musicBox: function() {
            if (debug == true) {
                if (window.location.hash != "#/musicBox/") {
                    return;
                }
                price = $('input[name="summa"]').val();
                if (price > 0) {
                    $.post("/mine/music-box/test/", {
                        "price": price
                    }, function(response) {
                        if (response.status == 'ok') {
                            console.log("Музыкальная шкатулка. Сумма выигрыша " + response.data + " бит");
                        }
                    });
                } else {
                    console.log("Укажите сумму ставки");
                }
            }
        },
    }
})(jQuery);