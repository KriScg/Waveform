var DrawButton = function( button )
{
	if ( button.enabled )
	{
		ctx.strokeStyle = button.focus ? 'red' : 'black';
		ctx.fillStyle = 'black';
		ctx.textAlign = 'center';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.rect( button.posX, button.posY, button.width, button.height );
		ctx.closePath();
		ctx.stroke();	
		ctx.fillText( button.text, button.posX + button.width * 0.5, button.posY + button.height * 0.5 );
	}
}

var ButtonMouseDown = function( button, mousePosX, mousePosY )
{
	return mousePosX >= button.posX && mousePosX <= button.posX + button.width && mousePosY >= button.posY && mousePosY <= button.posY + button.height;
}