(function($){


	/**
	 * Imagery
	 * -------
	 * @class Utility for image elements
	 */
	var Imagery = function(){

		var my = this;

		my.option = {
			// Source URLs
			blankGif : "./blank.gif",
			hoverSuffix : "-hover",
			activeSuffix : "-active",

			// Animation settings for `blendButton`
			enterEasing : "swing",
			enterDuration : 100,
			leaveEasing : "swing",
			leaveDuration : 500,

			// Preload
			preloadHover : true,
			preloadActive : true
		};

		my.dataKey = {
			info : "imageryInfo",
			alpha : "imageryAlpha",
			blend : "imageryBlend",
			active : "imageryActive",
			base : "imageryBase",
			above : "imageryAbove"
		};

		my.tmpl = {
			filter : "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='{{method}}', src='{{path}}')"
				+ " alpha(opacity={{opacity}})"
		};

		my.msie = false;
		my.msieVersion = null;

		/** 
		 * Initialize
		 *
		 * @return Imagery
		 */
		my.init = function(){
			var ua = navigator.userAgent.match(/MSIE\s([\d\.]+?);/);

			if(ua){
				this.msie = true;
				this.msieVersion = parseInt(ua[1], 10);
			}

			return this;
		};

		/**
		 * Configure
		 *
		 * @param Object option
		 * @return Imagery
		 */
		my.config = function(option){
			$.extend(this.option, option);

			return this;
		};

		/**
		 * Run the method
		 * 
		 * @param String method
		 * @param HTMLElement node
		 * @param Array args
		 * @return Imagery
		 */
		my.run = function(method, node, args){
			var _args;
			
			if(this.hasOwnProperty(method)){
				_args = $.extend([], args);
				_args.unshift(node);
				this[method].apply(this, _args);
			}

			return this;
		};

		/**
		 * Set filter(AlphaImageLoader) to the node
		 * 
		 * @param HTMLElement node
		 * @param Integer opacity 0-100
		 * @return Imagery
		 */
		my.alpha = function(node, opacity){
			var $node, info, extra;

			$node = $(node);
			info = this._getNodeInfo(node);
			opacity = $.isNumeric(opacity) ? opacity.toString() : 100;

			if(! this.msie || this.msieVersion >= 9 || ! info.png){
				return this;
			}
			if(info.type === "img"){
				$node.css({
					filter : this._render(this.tmpl.filter, {
						path : info.src,
						method : "scale",
						opacity : opacity
					}),
					width : $node.width(),
					height : $node.height()
				})
				.attr("src", this.option.blankGif);
			} else {
				$node.css({
					backgroundImage : "url(" + this.option.blankGif + ")",
					filter : this._render(this.tmpl.filter, {
						path : info.src,
						method : "crop",
						opacity : opacity
					})
				});
			}
			$node.data(this.dataKey.alpha, true);

			return this;
		};

		/**
		 * Swap `node`'s image source to `src`
		 *
		 * @param HTMLElement node
		 * @param String src
		 * @return Imagery
		 */
		my.swapImage = function(node, src){
			var $node, info;

			$node = $(node);
			info = this._getNodeInfo(node);

			if($node.data(this.dataKey.alpha)){
				$node.css({
					filter : this._render(this.tmpl.filter, {
						path : src,
						method : info.type === "img" ? "scale" : "crop"
					})
				});
			} else {
				if(info.type === "img"){
					$(node).attr("src", src);
				} else {
					$(node).css("background-image", "url(" + src + ")");
				}
			}

			return this;
		};

		/**
		 * Initialize `node` as swap button
		 * Override the default option with `option`
		 *
		 * @param HTMLElement node
		 * @param Object option
		 * @return Imagery
		 */
		my.swapButton = function(node, option){
			var option, info, files;

			option = $.extend({}, this.option, option);
			info = this._getNodeInfo(node);
			files = [];

			$(node).hover(function(e){
				var enter = e.type === "mouseenter";
				if(! $(this).data(my.dataKey.active)){
					my.swapImage(this, enter ? info.hover : info.src);
				}
			});

			option.preloadHover && files.push(info.hover);
			option.preloadActive && files.push(info.active);
			this.preload(files);

			return this;
		};

		/**
		 * Initialize `node` as blending button
		 * Override the default option with `option`
		 *
		 * @param HTMLElement node
		 * @param Object option
		 * @return Imagery
		 */
		my.blendButton = function(node, option){
			var $node, info, files;

			option = $.extend({}, this.option, option);
			$node = $(node);
			info = this._getNodeInfo(node);
			files = [];

			this._createAboveNode($node, info.hover)
			.hover(function(e){
				var $node, show;

				$node = $(this);
				show = (e.type === "mouseenter") 
					&& ! $node.data(my.dataKey.base).data(my.dataKey.active);
				$node.stop().animate(
					{ opacity : (show ? 1 : 0) },
					(show ? option.enterDuration : option.leaveDuration),
					(show ? option.enterEasing : option.leaveEasing)
				);
			})
			.on("click", function(){
				$(this).data(my.dataKey.base).trigger("click");
			});

			option.preloadHover && files.push(info.hover);
			option.preloadActive && files.push(info.active);
			this.preload(files);

			return this;
		};

		/**
		 * Create fake node for blending button
		 *
		 * @param jQueryObject $node
		 * @param String src
		 * @return jQueryObject
		 */
		my._createAboveNode = function($node, src){
			var $above = $("<img>")
			.attr({
				src : src
			})
			.css({
				position : "absolute",
				opacity : 0,
				width : $node.width(),
				heigth : $node.height(),
				zIndex : $node.css("z-index"),
				left : $node.css("left"),
				top : $node.css("top"),
				right : $node.css("right"),
				bottom : $node.css("bottom")
			})
			.data(this.dataKey.base, $node)
			.insertBefore($node);

			if($node.data(this.dataKey.alpha)){
				this.alpha($above.get(0), 0);
			}

			$node.data(this.dataKey.blend, true)
			.data(this.dataKey.above, $above);

			return $above;
		}

		/**
		 * Activate `node` in toggle buttons
		 * Wrappter of `_activate`
		 *
		 * @param HTMLElement node
		 * @return Imagery
		 */
		my.activate = function(node){
			this._activate(node, true);
			return this;
		};

		/**
		 * Deactivate `node` in toggle buttons
		 * Wrapper of `_activate`
		 *
		 * @param HTMLElement node
		 * @return Imagery
		 */
		my.deactivate = function(node){
			this._activate(node, false);
			return this;
		};

		/**
		 * Preload images
		 * When all `files` loaded, `callback` run
		 *
		 * @param Array|String files
		 * @param Function callback
		 * @return Imagery
		 */
		my.preload = function(files, callback){
			var count, onload;

			if(typeof files === "string"){
				files = [files];
			}
			count = files.length;
			onload = function(){
				count --;
				if(! count && $.isFunction(callback)){
					callback();
				}
			};
			$.each(files, function(index, value){
				var img = new Image();
				img.onload = onload;
				img.src = value;
			});

			return this;
		};

		/**
		 * Render `template` with `vars`
		 * Values in `vars` hash will be replace with `{{key}}`
		 *
		 * @param String template
		 * @param Object vars
		 * @return String
		 */
		my._render = function(template, vars){
			return template.replace(/\{\{(\w+?)\}\}/g, function(a, b){
				return vars[b] || "";
			});
		};

		/**
		 * Get node information
		 * If no information, call `_initNodeInfo`
		 *
		 * @param HTMLElement node
		 * @return Object
		 */
		my._getNodeInfo = function(node){
			var $node = $(node);

			if(! $node.data(this.dataKey.info)){
				this._initNodeInfo(node);
			}

			return $node.data(this.dataKey.info);
		};

		/**
		 * Initialize node information
		 *
		 * @param HTMLElement node
		 * @return Object
		 */
		my._initNodeInfo = function(node){
			var $node, info, m;

			$node = $(node);
			info = {};
			info.type = node.nodeName === "IMG" ? "img" : "common";

			if(info.type === "img"){
				info.src= $node.prop("src");
			} else {
				m = $node.css("background-image").match(/url\("?(.+?)"?\)/);
				info.src = m[1] || null;
			}

			info.hover = info.src.replace(/\.(\w+?)$/, this.option.hoverSuffix + "\.$1");
			info.active = info.src.replace(/\.(\w+?)$/, this.option.activeSuffix + "\.$1");
			info.png = info.src.match(/\.png$/) !== null;
			$node.data(this.dataKey.info, info);

			return info;
		};

		/**
		 * Activate or deactivate `node`
		 *
		 * @param HTMLElement node
		 * @param Boolean active
		 * @return Imagery
		 */
		my._activate = function(node, active){
			var $node, info;

			$node = $(node);
			info = this._getNodeInfo(node);
			this.swapImage(node, active ? info.active : info.src);
			$node.data(this.dataKey.active, active);
			if($node.data(this.dataKey.blend)){
				$node.data(this.dataKey.above).css("opacity", 0);
			}

			return this;
		};

		my.init.call(this);
	};

	$.extend($, {
		imagery : new Imagery(),
		imageryConfig : function(option){
			$.imagery.config(option);
		}
	});

	$.fn.extend({
		/**
		 * Call imagery method
		 *
		 * @param String method
		 * @param Mixed args (optional)
		 * @return jQueryObject
		 */
		imagery : function(method /* [, args] */){
			var self, args, i, methods;

			self = this;
			i = arguments.length;
			args = [];
			while(i--){
				args.push(arguments[arguments.length - i - 1]);
			}
			methods = args.shift();

			$.each(methods.split(","), function(index, method){
				method = $.trim(method);
				if(method){
					self.each(function(){
						$.imagery.run(method, this, args);
					});
				}
			});

			return this;
		}
	});

}(jQuery));