var GateTypeEnum =
{
	NOT	: 0,
	AND	: 1,
	OR	: 2
}

var gLevels = new Array
(
	// level 1
	{ 
		name:".01 Routing",
		desc:"Route clock from input to output.",
		toolboxStateMax:0,
		nodes:new Array
		(
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 0, 0, 0, 0,
			0, 0, 0, 1, 0, 1, 0, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		),
		output:
		{
			name:"Output", 
			nodeX:5, 
			nodeY:4,
			waveform:new Array( 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 )
		},
		inputs:new Array
		(
			{ 
				name:"Input",
				nodeX:3,
				nodeY:4,
				waveform:new Array( 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 )
			}
		),
	},
	
	// level 2
	{
		name:".02 Inverted",
		desc:"Invert clock input and route it to output.",
		toolboxStateMax:1,
		nodes:new Array
		(
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 0, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 0, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		),
		output:
		{
			name:"Output", 
			nodeX:5, 
			nodeY:4,
			waveform:new Array( 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0 )
		},
		inputs:new Array
		(
			{
				name:"Input",
				nodeX:3,
				nodeY:4,
				waveform:new Array( 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 )
			}
		),
	},
	
	// level 3
	{
		name:".03 Continuous",
		desc:"temp desc",
		toolboxStateMax:2,
		nodes:new Array
		(
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 1, 0, 0, 0,			
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		),
		output:
		{
			name:"Output", 
			nodeX:6, 
			nodeY:4,
			waveform:new Array( 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 )
		},
		inputs:new Array
		(
			{
				name:"Input",
				nodeX:3,
				nodeY:4,
				waveform:new Array( 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 )
			}
		),
	},
	
	// level 4
	{
		name:".04 Maximum",
		desc:"temp desc",
		toolboxStateMax:2,
		nodes:new Array
		(
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 0, 0, 0, 0,
			0, 0, 1, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 1, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		),
		output:
		{
			name:"Output", 
			nodeX:6, 
			nodeY:4,
			waveform:new Array( 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1 )
		},
		inputs:new Array
		(
			{
				name:"InputA",
				nodeX:2,
				nodeY:4,
				waveform:new Array( 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 )
			},
			{
				name:"InputB",
				nodeX:2,
				nodeY:5,
				waveform:new Array( 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1 )
			}			
		),
	},
	
	// level 5
	{
		name:".05 Selector",
		desc:"temp desc",
		toolboxStateMax:3,
		nodes:new Array
		(
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 1, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 1, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 1, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 1, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		),
		output:
		{
			name:"Output", 
			nodeX:6, 
			nodeY:4,
			waveform:new Array( 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1 )
		},
		inputs:new Array
		(
			{
				name:"InputA",
				nodeX:2,
				nodeY:4,
				waveform:new Array( 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 )
			},
			{
				name:"InputB",
				nodeX:2,
				nodeY:5,
				waveform:new Array( 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1 )
			},
			{
				name:"InputC",
				nodeX:2,
				nodeY:6,
				waveform:new Array( 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1 )
			}	
		),
	}	
);