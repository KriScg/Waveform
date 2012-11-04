
var DrawGate = function( type, nodeX, nodeY, rotation )
{
	ctx.save();
	ctx.translate( GRID_OFF_X + ( nodeX + 0.5 ) * TILE_W, GRID_OFF_Y + ( nodeY + 0.5 ) * TILE_H );
	ctx.rotate( rotation )
	
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 2;
	ctx.beginPath();
	
	switch ( type )
	{
		case GateTypeEnum.NOT: 	DrawNOT(); 	break;
		case GateTypeEnum.AND: 	DrawAND(); 	break;
		case GateTypeEnum.OR: 	DrawOR(); 	break;
	}
	DrawGateInputs();
	DrawGateOutputs();

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
}

var DrawNOT = function()
{
	var size = 10;
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
}