	var world;

	var worldWidth = 20;
	var worldHeight = 14;
	var homeX = worldWidth/2;
	var homeY = -10;
	var drawScale = 30.0;
	
	var drawables = [];

	function Drawable(imageUri, body)
	{
		this.ready = false;
		this.body = body.GetBody();
		this.image = new Image();
		this.image.onload = function()
		{
			this.ready = true;
		}
		this.image.src = imageUri;

		this.draw = function (context)
		{
			var angle = this.body.GetAngle();
			var position = this.body.GetPosition();
			drawRotatedImage(this.image, context, position.x * drawScale, position.y * drawScale, angle);
		}
	}
	
	function drawRotatedImage(image, context, x, y, rotation)
	{
		context.save(); 
		var w = image.width;
		var h = image.height;
		context.translate(x, y); 
		context.rotate(rotation); 
		context.drawImage(image, 0 - w/2, 0 - h/2); 
		context.restore();
	}
	
	var ingredients = {
		bottomBun : {
			image : "images/bottombun.png",
			halfWidth : 7,
			halfHeight : 1
		},
		patty : {
			image : "images/patty.png",
			halfWidth : 6,
			halfHeight : 1
		},
		cheese : {
			image : "images/cheese.png",
			halfWidth : 6,
			halfHeight : .25
		},
		hipsters : {
			image : "images/hipsters.png",
			halfWidth : 6,
			halfHeight : 1.2
		}
	}

	var   b2Vec2 = Box2D.Common.Math.b2Vec2
	,	b2BodyDef = Box2D.Dynamics.b2BodyDef
	,	b2Body = Box2D.Dynamics.b2Body
	,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
	,	b2Fixture = Box2D.Dynamics.b2Fixture
	,	b2World = Box2D.Dynamics.b2World
	,	b2MassData = Box2D.Collision.Shapes.b2MassData
	,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
	,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
	,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
	;

	function init() {
	 
	 world = new b2World(
		   new b2Vec2(0, 30)    //gravity
		,  true                 //allow sleep
	 );
	 
	 var fixDef = new b2FixtureDef;
	 fixDef.density = 1.0;
	 fixDef.friction = 0.5;
	 fixDef.restitution = 0.2;
	 
	 var bodyDef = new b2BodyDef;
	 
	 //create ground
	 bodyDef.type = b2Body.b2_staticBody;
	 bodyDef.position.x = homeX;
	 bodyDef.position.y = worldHeight;
	 fixDef.shape = new b2PolygonShape;
	 fixDef.shape.SetAsBox(worldWidth/2, 0.5);
	 world.CreateBody(bodyDef).CreateFixture(fixDef);
	 
	MakeBottomBun();
	 
	 //setup debug draw
	 var debugDraw = new b2DebugDraw();
		debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
		debugDraw.SetDrawScale(30.0);
		debugDraw.SetFillAlpha(0.3);
		debugDraw.SetLineThickness(1.0);
		debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
		world.SetDebugDraw(debugDraw);
	 
	 window.setInterval(update, 1000 / 45);
	};

	function createIngredient(definition)
	{
		var bodyDef = new b2BodyDef;
		bodyDef.position.x = homeX + Math.random() * .1;
		bodyDef.position.y = homeY + Math.random() * .1;
		bodyDef.angle = Math.random() * .05;
		bodyDef.type = b2Body.b2_dynamicBody;

		var fixDef = new b2FixtureDef;
		fixDef.density = 1.0;
		fixDef.friction = 0.5;
		fixDef.restitution = 0.4;
		fixDef.shape = new b2PolygonShape;
		fixDef.shape.SetAsBox(definition.halfWidth, definition.halfHeight);

		var body = world.CreateBody(bodyDef).CreateFixture(fixDef);
		
		drawables.push(new Drawable(definition.image, body));

		//create some objects
	}
	
	

	function update() {
	 world.Step(
		   1 / 45   //frame-rate
		,  10       //velocity iterations
		,  10       //position iterations
	 );
	 //world.DrawDebugData();
	 var canvas = document.getElementById("canvas");
	 //clear the canvas
	 canvas.width = canvas.width;
	 
	 //draw ALL the things!
	 for (var i=0; i < drawables.length; i++)
		drawables[i].draw(canvas.getContext("2d"));
		
	 world.ClearForces();
	};
	
	function MakeBottomBun()	{		createIngredient(ingredients.bottomBun);	}
	function MakeBurgerPatty()	{		createIngredient(ingredients.patty);	}
	function MakeCheese()		{		createIngredient(ingredients.cheese);	}
	function MakeHipsters()		{		createIngredient(ingredients.hipsters);	}
	
	function ClearBuilder()
	{
		for (var i=0; i<drawables.length; i++)
		{
			world.DestroyBody(drawables[i].body);
		}
		
		drawables = [];
		MakeBottomBun();
	}
