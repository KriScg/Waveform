var DrawGate = function( type, nodeX, nodeY, rotation )
{
	ctx.save();
	if ( type == GateTypeEnum.NOT )
	{
		ctx.translate( GRID_OFF_X + ( nodeX + 0.5 ) * TILE_W, GRID_OFF_Y + nodeY * TILE_H );
	}
	else
	{
		ctx.translate( GRID_OFF_X + ( nodeX + 0.5 ) * TILE_W, GRID_OFF_Y + ( nodeY + 0.5 ) * TILE_H );
	}
	ctx.rotate( rotation )

	ctx.strokeStyle = 'black';
	ctx.lineWidth = 2;
	ctx.beginPath();
	
	switch ( type )
	{
		case GateTypeEnum.NOT: 		DrawNOT(); 		break;
		case GateTypeEnum.AND: 		DrawAND(); 		break;
		case GateTypeEnum.OR: 		DrawOR(); 		break;
		case GateTypeEnum.CROSS: 	DrawCross(); 	break;
	}

	ctx.stroke();
	ctx.restore();
}

var DrawGateInputs = function()
{
	var size = 10;
	ctx.moveTo( -size, -size * 0.5 );
	ctx.lineTo( -0.5 * TILE_W, -size * 0.5 );
	ctx.lineTo( -0.5 * TILE_W, -size * 2 );
	ctx.moveTo( -size, size * 0.5 );
	ctx.lineTo( -0.5 * TILE_W, size * 0.5 );
	ctx.lineTo( -0.5 * TILE_W, size * 2 );
}

var DrawGateOutputs = function()
{
	var size = 10;
	ctx.moveTo( size, 0 );
	ctx.lineTo( 0.5 * TILE_W, 0 );
	ctx.lineTo( 0.5 * TILE_W, -size * 2 );
	ctx.moveTo( 0.5 * TILE_W, 0 );
	ctx.lineTo( 0.5 * TILE_W, size * 2 );
}

var DrawAND = function()
{
	var size = 10;
	ctx.arc( 1, 0, size, 1.5 * Math.PI, 0.5 * Math.PI, false );
	ctx.moveTo( 1, -size );
	ctx.lineTo( -size, -size );
	ctx.lineTo( -size, size );
	ctx.lineTo( 1, size );

	DrawGateInputs();
	DrawGateOutputs();	
}

var DrawNOT = function()
{
	var size = 8;
	ctx.moveTo( -0.5 * TILE_H, 0 );
	ctx.lineTo( -size, 0 );
	ctx.moveTo( size, 0 );
	ctx.lineTo( +0.5 * TILE_H, 0 );
	ctx.moveTo( size, 0 );
	ctx.lineTo( 1 - size, -size - 1 );
	ctx.lineTo( 1 - size, size + 1 );
	ctx.lineTo( size, 0 );
}

var DrawOR = function()
{
	var size = 10;
	//ctx.arc( 1, 0, size, 1.5 * Math.PI, 0 * Math.PI, false );	
	ctx.moveTo( 1, -size );
	ctx.lineTo( -size - 3, -size );
	ctx.quadraticCurveTo( -2, 0, -size - 3, size )
	ctx.lineTo( 1, size );
	ctx.quadraticCurveTo( 0.75 * size, 0.75 * size, size, 0 )
	ctx.quadraticCurveTo( 0.75 * size, -0.75 * size, 1, -size )
	
	DrawGateInputs();
	DrawGateOutputs();	
}

var DrawCross = function()
{
	DrawGateInputs();
	DrawGateOutputs();
}

var DrawButton = function( button )
{
	if ( button.enabled )
	{		
		DrawRoundedRect( button.posX, button.posY, button.width, button.height, 10, 2, button.focus ? 'red' : 'black', button.background );

		ctx.textAlign 		= 'center';		
		ctx.textBaseline 	= 'middle';
		ctx.fillStyle 		= 'black'
		ctx.fillText( button.text, button.posX + button.width * 0.5, button.posY + button.height * 0.5 );
	}
}

var DrawRoundedRect = function( x, y, width, height, radius, lineWidth, strokeStyle, fillStyle )
{
	ctx.lineWidth	= lineWidth;
	ctx.strokeStyle	= strokeStyle;
	ctx.fillStyle 	= fillStyle;
	ctx.beginPath();
	ctx.moveTo(x+radius,y);
    ctx.arcTo(x+width,y,x+width,y+radius,radius);
	ctx.arcTo(x+width,y+height,x+width-radius,y+height,radius); 
	ctx.arcTo(x,y+height,x,y+height-radius,radius);
	ctx.arcTo(x,y,x+radius,y,radius);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}