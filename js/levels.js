var GateTypeEnum =
{
	NOT		: 0,
	OR		: 1,
	AND		: 2,
	CROSS	: 3
}

var gLevels =
[
	// level 1
	{
		name:'.01 Routing',
		desc:'Route clock signal from input to output. Click between the nodes in order to connect them. After connecting nodes use verify button.',
		toolboxStateMax:0,
		nodes:
		[
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
		],
		pins:
		[
			{
				name:'Input',
				nodeX:3,
				nodeY:4,
				waveform:[ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ]
			},
			{
				name:'Output', 
				nodeX:5, 
				nodeY:4,
				simWaveform:[],
				waveform:[ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ]
			}
		]
	},

	// level 2
	{
		name:'.02 Inverted',
		desc:'Use NOT gate to invert input and route it to output.',
		toolboxStateMax:1,
		nodes:
		[
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
		],
		pins:
		[
			{
				name:'Input',
				nodeX:3,
				nodeY:4,
				waveform:[ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ]
			},
			{
				name:'Output', 
				nodeX:5, 
				nodeY:4,
				simWaveform:[],
				waveform:[ 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0 ]
			}
		]
	},
	
	// level 3
	{
		name:'.03 Continuous',
		desc:'Generate continuous signal using NOT gates.',
		toolboxStateMax:1,
		nodes:
		[
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
		],
		pins:
		[
			{
				name:'Input',
				nodeX:3,
				nodeY:4,
				waveform:[ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ]
			},
			{
				name:'Output', 
				nodeX:6, 
				nodeY:4,
				simWaveform:[],
				waveform:[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ]
			},			
		]
	},
	
	// level 4
	{
		name:'.04 Undefined',
		desc:'There are 3 types of signal: LO (blue), HI (red) and undefined (purple).',
		toolboxStateMax:1,
		nodes:
		[
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
		],
		pins:
		[
			{
				name:'Input',
				nodeX:3,
				nodeY:4,
				waveform:[ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ]
			},
			{
				name:'Output', 
				nodeX:6, 
				nodeY:4,
				simWaveform:[],
				waveform:[ 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 ]
			}
		]
	},	
	
	// level 5
	{
		name:'.05 Maximum',
		desc:'Try to analyze input and output signals and find the pattern. Remember to use new available gate type - OR. It produces HI if any of it\'s inputs are HI',
		toolboxStateMax:2,
		nodes:
		[
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
		],
		pins:
		[	
			{
				name:'InputA',
				nodeX:2,
				nodeY:4,
				waveform:[ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ]
			},
			{
				name:'InputB',
				nodeX:2,
				nodeY:5,
				waveform:[ 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1 ]
			},
			{
				name:'Output', 
				nodeX:6, 
				nodeY:4,
				simWaveform:[],
				waveform:[ 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1 ]
			}			
		]
	},
	
	// level 6
	{
		name:'.06 Conditional',
		desc:'New gate type is available - AND. It produces HI signal only if both inputs are HI.',
		toolboxStateMax:3,
		nodes:
		[
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
		],
		pins:
		[
			{
				name:'InputA',
				nodeX:2,
				nodeY:4,
				waveform:[ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ]
			},
			{
				name:'InputB',
				nodeX:2,
				nodeY:5,
				waveform:[ 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1 ]
			},
			{
				name:'Output', 
				nodeX:6, 
				nodeY:4,
				simWaveform:[],
				waveform:[ 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1 ]
			}
		]
	},
	
	// level 7
	{
		name:'.07 Exclusive',
		desc:'...',
		toolboxStateMax:3,
		nodes:
		[
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
		],
		pins:
		[
			{
				name:'InputA',
				nodeX:2,
				nodeY:4,
				waveform:[ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ]
			},
			{
				name:'InputB',
				nodeX:2,
				nodeY:5,
				waveform:[ 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0 ]
			},
			{
				name:'Output', 
				nodeX:6, 
				nodeY:4,
				simWaveform:[],
				waveform:[ 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1 ]
			},
		]
	},	

	// level 8
	{
		name:'.08 Match',
		desc:'...',
		toolboxStateMax:3,
		nodes:
		[
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
		],
		pins:
		[
			{
				name:'InputA',
				nodeX:2,
				nodeY:4,
				waveform:[ 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0 ]
			},
			{
				name:'InputB',
				nodeX:2,
				nodeY:5,
				waveform:[ 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0 ]
			},
			{
				name:'InputC',
				nodeX:2,
				nodeY:6,
				waveform:[ 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1 ]
			},		
			{
				name:'Output', 
				nodeX:6, 
				nodeY:4,
				simWaveform:[],
				waveform:[ 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0 ]
			}		
		]
	},
	
	// level 9
	{
		name:'.09 Selector',
		desc:'...',
		toolboxStateMax:3,
		nodes:
		[
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
		],
		pins:
		[
			{
				name:'InputA',
				nodeX:2,
				nodeY:4,
				waveform:[ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ]
			},
			{
				name:'InputB',
				nodeX:2,
				nodeY:5,
				waveform:[ 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1 ]
			},
			{
				name:'InputC',
				nodeX:2,
				nodeY:6,
				waveform:[ 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1 ]
			},
			{
				name:'Output', 
				nodeX:6, 
				nodeY:4,
				simWaveform:[],
				waveform:[ 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1 ]
			},			
		]
	},
	
	// level 10
	{
		name:'.10 Crossing',
		desc:'...',
		toolboxStateMax:4,
		nodes:
		[
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
		],
		pins:
		[
			{
				name:'InputA',
				nodeX:3,
				nodeY:4,
				waveform:[ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ]
			},
			{
				name:'InputB',
				nodeX:3,
				nodeY:5,
				waveform:[ 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1 ]
			},
			{
				name:'OutputA',
				nodeX:6,
				nodeY:4,
				simWaveform:[],
				waveform:[ 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1 ]
			},
			{
				name:'OutputB', 
				nodeX:6, 
				nodeY:5,
				simWaveform:[],
				waveform:[ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ]
			},			
		]
	},	
	
	// level 11
	{
		name:'.11 State',
		desc:'Now this one is a bit different...',
		toolboxStateMax:4,
		nodes:
		[
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		],
		pins:
		[
			{
				name:'InputR',
				nodeX:3,
				nodeY:4,
				waveform:[ 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ]
			},
			{
				name:'InputS',
				nodeX:3,
				nodeY:5,
				waveform:[ 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0 ]
			},		
			{
				name:'Output', 
				nodeX:6, 
				nodeY:4,
				simWaveform:[],
				waveform:[ 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1 ]
			}
		]
	},	
	
	// level 10
	{
		name:'.10 TEST',
		desc:'...',
		toolboxStateMax:4,
		nodes:
		[
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1
		],
		pins:
		[
			{
				name:'InputA',
				nodeX:2,
				nodeY:4,
				waveform:[ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ]
			},
			{
				name:'InputB',
				nodeX:2,
				nodeY:5,
				waveform:[ 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1 ]
			},
			{
				name:'InputC',
				nodeX:2,
				nodeY:6,
				waveform:[ 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1 ]
			},
			{
				name:'Output', 
				nodeX:6, 
				nodeY:4,
				simWaveform:[],
				waveform:[ 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1 ]
			},			
		]
	}
];