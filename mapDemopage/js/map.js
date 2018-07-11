			var myWidth = 0,
			    myHeight = 0,
			    bIsLoad = false;

			function screenResize() {
			    if (typeof($(window).innerWidth()) == 'number') {
			        //Non-IE
			        myWidth = $(window).innerWidth();
			        myHeight = $(window).innerHeight();
			    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
			        //IE 6+ in 'standards compliant mode'
			        myWidth = document.documentElement.clientWidth;
			        myHeight = document.documentElement.clientHeight;
			    }
			    window.onresize = function() {
			        if (typeof($(window).innerWidth()) == 'number') {
			            //Non-IE
			            myWidth = window.innerWidth;
			            myHeight = window.innerHeight;
			        } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
			            //IE 6+ in 'standards compliant mode'
			            myWidth = document.documentElement.clientWidth;
			            myHeight = document.documentElement.clientHeight;
			        }
			        mapheight();
			    }
			}
			var element = document.getElementById('myresource');
			var editor = CodeMirror.fromTextArea(element, {
			    mode: "htmlmixed",
			    lineWrapping: true,
			    scrollbarStyle: "simple",
			    styleActiveLine: true,
			    tabMode: 'indent',
			    autoCloseTags: true
			});
			var initValue = null;
			$("#tree").on('changed.jstree', function(e, data) {
			    var i, j;
			    for (i = 0, j = data.selected.length; i < j; i++) {
			        var select_node = data.instance.get_node(data.selected[i]);
			        if (select_node.li_attr.name && bIsLoad) {
			            var url = "./mapdemo/" + select_node.li_attr.name;
			            getHtmlData(url);
			        } else {
			            data.instance.open_node(data.selected[i]);
			        }

			    }

			}).jstree({
			    "core": {
			        "data": data
			    }
			});

			function cleanFrame() {
			    var mapcon = document.getElementById("mapContent");
			    var pre = document.getElementById("container");
			    mapcon.removeChild(pre);
			    mapcon.appendChild(pre);
			}

			function getHtmlData(url) {
			    $.get(url, {}, function(result) {
			        editor.setValue(result);
			        initValue = editor.getValue();
			        run();
			        bIsLoad = true;
			    })
			}

			var preview = document.getElementById('container');

			function refresh() {
			    if (initValue) {
			        editor.setValue(initValue);
			        updatePreview();
			    }
			}

			function run() {
			    updatePreview();
			}

			function updatePreview() {
			    cleanFrame();
			    previewContent = preview.contentDocument || preview.contentWindow.document;
			    previewContent.open();
			    previewContent.write(editor.getValue());
			    previewContent.close();
			}

			function mapheight() {
			    $("#container").width(myWidth - $("#menu")[0].offsetWidth - $("#code_area")[0].offsetWidth - 5);
			    $("#container").height(myHeight + 80);

			}
			screenResize();
			var initUrl = "./mapdemo/simple.html";
			getHtmlData(initUrl);
