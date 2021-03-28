$(function() {
	var positionGameZone = $("#canvas").offset();
	var dogMargin = 20;
	var cowMargin = 40;
	var topMargin = 180;
	var leftMargin = 160;
	var backgroundWidth = 1080;
	var backgroundHeight = 600;
	
	/*dogX, dogY, dogDir, dogStatus, dogXdest, dogYdest, dogSprite, dogAnim*/
	/*dogDir = 0:left 1:right*/
	/*dogStatus 0:sitting 1:running 2:ouaf*/
	var dog = [400,300,1,0,400,300,0,0];

	var dogSprite=  [
			['images/Dog03_toLeft.png','images/Dog03_toLeft.png'],
			['images/Dog01_toLeft.png','images/Dog02_toLeft.png'],
			['images/Dog03_toLeft.png','images/Dog04_toLeft.png'],
			['images/Dog03_toRight.png','images/Dog03_toRight.png'],
			['images/Dog01_toRight.png','images/Dog02_toRight.png'],
			['images/Dog03_toRight.png','images/Dog04_toRight.png']
			];

	/*cowX, cowY, cowDir, cowStatus, cowXdest, cowYdest, cowSprite, cowCounter*/
	/*cowCounter: running=fearLevel  meuh=duration*/
	/*cowDir = 0:left 1:right*/
	/*cowStatus 0:waiting 1:running 2:meuh 3:eating*/
	/*var cows = [
			[ 42,224,0,0, 42,224,0,0],
			[263,211,1,0,263,211,0,0],
			[392,231,1,0,392,231,,0,0],
			[168,267,0,0,168,267,0,0],
			[366,305,0,0,366,305,0,0],
			[ 41,375,1,0, 41,375,0,0],
			[152,373,1,0,152,373,0,0],
			[277,425,1,0,277,425,0,0],
			[415,415,0,0,415,415,0,0],
			[ 54,494,0,0, 54,494,0,0],
			[209,535,1,0,209,535,0,0],
			[378,512,0,0,378,512,0,0],
			[490,266,1,0,490,266,0,0],
			[581,218,0,0,581,218,0,0],
			[688,200,0,0,688,200,0,0],
			[520,389,1,0,520,389,0,0],
			[669,338,0,0,669,338,0,0],
			[554,464,1,0,554,464,0,0],
			[659,426,1,0,659,426,0,0],
			[683,527,0,0,683,527,0,0]
		   ];
	*/

	var cows = [
			[ 42,224,0,0, 42,224,0,0],
			[263,211,1,0,263,211,0,0],
			[392,231,1,0,392,231,,0,0],
			[168,267,0,0,168,267,0,0],
			[366,305,0,0,366,305,0,0],
			[ 41,375,1,0, 41,375,0,0]
		   ];

	var cowSprite = [
			['images/Cow01_toLeft.png','images/Cow01_toLeft.png'],
			['images/Cow01_toLeft.png','images/Cow02_toLeft.png'],
			['images/Cow01_toLeft.png','images/Cow01_toLeft.png'],
			['images/Cow03_toLeft.png','images/Cow03_toLeft.png'],
			['images/Cow01_toRight.png','images/Cow01_toRight.png'],
			['images/Cow01_toRight.png','images/Cow02_toRight.png'],
			['images/Cow01_toRight.png','images/Cow01_toRight.png'],
			['images/Cow03_toRight.png','images/Cow03_toRight.png']
			];

	var meuh = 100;

	/*bullX, bullY, bullDir, bullStatus, bullXdest, bullYdest, bullSprite*/
	/*cowStatus 0:waiting 1:running*/
	var bulls = 	[
			[264,316,0,0,264,316,0,0],
			[127,482,1,0,127,482,0,0],
			[587,285,0,0,587,285,0,0],
			[483,519,0,0,483,519,0,0]
			];

	var bullSprite = [['images/Bull01_toLeft.png','images/Bull01_toLeft.png'],
			  ['images/Bull01_toLeft.png','images/Bull02_toLeft.png'],
			  ['images/Bull01_toRight.png','images/Bull01_toRight.png'],
			  ['images/Bull01_toRight.png','images/Bull02_toRight.png']
			 ];

	var animationCpt = 0;
	
	function myLoop(){
		calcAnim();
		animDog();
		animCow();
		/*animBull();*/
		drawDog();
		drawCow();
		drawMeuh();
		/*drawBull();*/
		


	}
	checkKeys();
	setInterval(myLoop,30);


/*+++++++++++++++++++++++++++++++++++++++++++++++*/
/*++++++++++++++++     CHECKS     +++++++++++++++*/
/*+++++++++++++++++++++++++++++++++++++++++++++++*/

/*####################################################*/
	function checkKeys(){
		/*$(document).keydown(function(e){
  			if(e.which == 39){dog[0] = dog[0] + 10;}
			else if(e.which == 37){dog[0] = dog[0] - 10;}

  			if(e.which == 40){dog[1] = dog[1] + 10;}
			else if(e.which == 38){dog[1] = dog[1] - 10;}
		});*/

		$('#foreground').on( "click", function(e){
			positionGameZone = $("#canvas").offset();
			dog[3]=1;
			dog[4] = Math.floor(e.pageX - positionGameZone.left -15);
			dog[5] = Math.floor(e.pageY - positionGameZone.top -11);
			if(dog[4]<dog[0]){dog[2]=0;}
			else{dog[2]=1;}

		});

		$('#dog').on( "click", function(e){
			dog[3] = 2;
			dog[4] = dog[0];
			dog[5] = dog[1];
			calcCowDestination();
			calcBullDestination();
		});
	}



/*+++++++++++++++++++++++++++++++++++++++++++++++*/
/*++++++++++++++++      ANIM      +++++++++++++++*/
/*+++++++++++++++++++++++++++++++++++++++++++++++*/

/*####################################################*/
	function calcAnim(){
		animationCpt = animationCpt+1;
		if(animationCpt >100){animationCpt = 0;}

		if(animationCpt%50==1){
			if(meuh<50){meuh=200;}
			else{meuh = Math.floor(Math.floor(Math.random() *100)/2);}
		}
	}

/*####################################################*/
	function calcCowDestination(){
		var tresPres = 40;
		var moyenPres = 90;
		var loin = 140;

		for(var i = 0; i < cows.length;i++){
			var posXcow = cows[i][0];
			var posYcow = cows[i][1];
			var posXdog = dog[0];
			var posYdog = dog[1];
			
			var distX = 0;
			var dirX = 1;
			var distY = 0;
			var dirY = 1;

			var dist = 0;
			var newDist = 0;

			if(posXcow>=posXdog)	{dirX=1;	distX = posXcow-posXdog;}
			else			{dirX=-1;	distX = posXdog-posXcow;}
			
			if(posYcow>=posYdog)	{dirY=1;	distY = posYcow-posYdog;}
			else			{dirY=-1;	distY = posYdog-posYcow;}

			dist = Math.floor(Math.sqrt((distX*distX) + (distY*distY)));
			
			if(dist<=tresPres){
				newDist = (loin - dist)*2;
				
				distX = Math.floor(distX*newDist/dist);
				cows[i][4] = cows[i][0] + (distX*dirX);
				cows[i][2] = (dirX+1)/2;
				cows[i][3] = 1;
				
				distY = Math.floor(distY*newDist/dist);
				cows[i][5] = cows[i][1] + (distY*dirY);
			}

			if(dist>tresPres && dist <= moyenPres){
				newDist = Math.floor((loin - dist)*1.5);
				
				distX = Math.floor(distX*newDist/dist);
				cows[i][4] = cows[i][0] + (distX*dirX);
				cows[i][2] = (dirX+1)/2;
				cows[i][3] = 1;
				
				distY = Math.floor(distY*newDist/dist);
				cows[i][5] = cows[i][1] + (distY*dirY);
			}

			if(dist>moyenPres && dist <=loin){
				newDist = (loin - dist)*1;
				
				distX = Math.floor(distX*newDist/dist);
				cows[i][4] = cows[i][0] + (distX*dirX);
				cows[i][2] = (dirX+1)/2;
				cows[i][3] = 1;
				
				distY = Math.floor(distY*newDist/dist);
				cows[i][5] = cows[i][1] + (distY*dirY);
			}

			if(dist>loin){}

		}
	}

/*####################################################*/
	function calcBullDestination(){


	}

/*####################################################*/
	function animDog(){
		/*tous les 5 loop, changement de sprite*/
		if(animationCpt%5 == 0){
			if(dog[6]==0){dog[6]=1;}
			else{dog[6]=0;}
		}

		/*Le chien aboie 2x et s'arrête*/
		if(dog[3]==2){
			dog[7] = dog[7]+1;
			if(dog[7]>=4*5){
				dog[7]=0;
				dog[3]=0;
			}
		}

		/*trajectoire du chien*/
		if(dog[0]!=dog[4] || dog[1]!=dog[5]){
			var ratio = 1;
			var distX = dog[4]-dog[0];
			var distY = dog[5]-dog[1];
			var trajectoireSide = 0;
			var tmpMoveX = 0;
			var tmpMoveY = 0;

			if(distX>=0){
				if(distY>=0){
					/*direction = 3;*/
					absMoveX = 1;
					absMoveY = 1;
				}else{
					/*direction = 0;*/
					absMoveX = 1;
					absMoveY = -1;
				}
			}else{
				if(distY>=0){
					/*direction = 2;*/
					absMoveX = -1;
					absMoveY = 1;
				}else{
					/*direction = 1;*/
					absMoveX = -1;
					absMoveY = -1;
				}
			}

			if(Math.abs(distX)>=Math.abs(distY)){
				if(distY==0){ratio = 20;}
				else{ratio = Math.abs(distX)/Math.abs(distY);}
				trajectoireSide = 0;
			}else{
				if(distX==0){ratio = 20;}
				else{ratio = Math.abs(distY)/Math.abs(distX);}
				trajectoireSide = 1;
			}

			if(trajectoireSide==0){
				if(ratio>12)			{tmpMoveX=6; tmpMoveY=0;}
				if(ratio<=12 && ratio>4.5)	{tmpMoveX=6; tmpMoveY=1;}
				if(ratio<=4.5 && ratio>2.33)	{tmpMoveX=6; tmpMoveY=2;}
				if(ratio<=2.33 && ratio>1.33)	{tmpMoveX=5; tmpMoveY=3;}
				if(ratio<=1.33)			{tmpMoveX=4; tmpMoveY=4;}
			}else{
				if(ratio>12)			{tmpMoveX=0; tmpMoveY=6;}
				if(ratio<=12 && ratio>4.5)	{tmpMoveX=1; tmpMoveY=6;}
				if(ratio<=4.5 && ratio>2.33)	{tmpMoveX=2; tmpMoveY=6;}
				if(ratio<=2.33 && ratio>1.33)	{tmpMoveX=3; tmpMoveY=5;}
				if(ratio<=1.33)			{tmpMoveX=4; tmpMoveY=4;}
			}

			/*gestion X*/
			if(dog[0]==dog[4])							{/*Pas bouger!!*/}													/*Si le chien est arrivé à destination*/
			else if(dog[0]+(tmpMoveX*absMoveX)>backgroundWidth-(leftMargin+dogMargin)){dog[0]=backgroundWidth-(leftMargin+dogMargin);dog[4]=backgroundWidth-(leftMargin+dogMargin);dog[5]=dog[1];}	/*Si le chien arrive près du bord droit*/
			else if(dog[0]+(tmpMoveX*absMoveX)<dogMargin)				{dog[0]=dogMargin;dog[4]=dogMargin;dog[5]=dog[1];}									/*Si le chien arrive près du bord gauche*/
			else if(dog[0]<dog[4] && dog[0]+(tmpMoveX*absMoveX)>dog[4])		{dog[0]=dog[4];}													/*Si le chien arrive à destination*/
			else if(dog[0]>dog[4] && dog[0]+(tmpMoveX*absMoveX)<dog[4])		{dog[0]=dog[4];}													/*Si le chien arrive à destination*/
			else									{dog[0]=dog[0]+(tmpMoveX*absMoveX);}											/*Sinon on bouge*/
			


			/*gestion Y*/
			if(dog[1]==dog[5])							{/*Pas bouger!!*/}													/*Si le chien est arrivé à destination*/
			else if(dog[1]+(tmpMoveY*absMoveY)<topMargin+dogMargin)			{dog[1]=topMargin+dogMargin;dog[5]=topMargin+dogMargin;dog[4]=dog[0];}							/*Si le chien est arrivé près du bord haut*/
			else if(dog[1]+(tmpMoveY*absMoveY)>backgroundHeight-dogMargin)		{dog[1]=backgroundHeight-dogMargin;dog[5]=backgroundHeight-dogMargin;dog[4]=dog[0];}				/*Si le chien est arrivé près du bord bas*/
			else if(dog[1]<dog[5] && dog[1]+(tmpMoveY*absMoveY)>dog[5])		{dog[1]=dog[5];}													/*Si le chien arrive à destination*/
			else if(dog[1]>dog[5] && dog[1]+(tmpMoveY*absMoveY)<dog[5])		{dog[1]=dog[5];}													/*Si le chien arrive à destination*/
			else									{dog[1]=dog[1]+(tmpMoveY*absMoveY);}											/*Sinon on bouge*/
			
			if(dog[0]==dog[4] && dog[1]==dog[5]){dog[3]=0;}

		}
	}	

/*####################################################*/
	function animCow(){
		/*tous les 5 loop, changement de sprite*/
		for(var i = 0; i < cows.length;i++){
			if((animationCpt+i)%5 == 0){
				if(cows[i][6]==0){cows[i][6]=1;}
				else{cows[i][6]=0;}
			}	


			/*Cow is waiting*/
			if(cows[i][3]==0){
				/*eat grass or not*/
				/*set timer*/
			}

			/*Cow is eating grass*/			
			if(cows[i][3]==3){
				/*decrease timer*/
				/*if timer == 0, cow is waiting*/
			}

			/*Cow is running*/
			if(cows[i][3]==1){
				/*calculate new position*/
				/*check collision with previous already move cows*/
				/*decrease fear level*/

				if(cows[i][0]!=cows[i][4] || cows[i][1]!=cows[i][5]){
					var ratio = 1;
					var distX = cows[i][4]-cows[i][0];
					var distY = cows[i][5]-cows[i][1];
					var trajectoireSide = 0;
					var tmpMoveX = 0;
					var tmpMoveY = 0;

					if(distX>=0){
						if(distY>=0){
							absMoveX = 1;
							absMoveY = 1;
						}else{
							absMoveX = 1;
							absMoveY = -1;
						}
					}else{
						if(distY>=0){
							absMoveX = -1;
							absMoveY = 1;
						}else{
							absMoveX = -1;
							absMoveY = -1;
						}
					}

					if(Math.abs(distX)>=Math.abs(distY)){
						if(distY==0){ratio = 20;}
						else{ratio = Math.abs(distX)/Math.abs(distY);}
						trajectoireSide = 0;
					}else{
						if(distX==0){ratio = 20;}
						else{ratio = Math.abs(distY)/Math.abs(distX);}
						trajectoireSide = 1;
					}

					if(trajectoireSide==0){
						if(ratio>12)			{tmpMoveX=6; tmpMoveY=0;}
						if(ratio<=12 && ratio>4.5)	{tmpMoveX=6; tmpMoveY=1;}
						if(ratio<=4.5 && ratio>2.33)	{tmpMoveX=6; tmpMoveY=2;}
						if(ratio<=2.33 && ratio>1.33)	{tmpMoveX=5; tmpMoveY=3;}
						if(ratio<=1.33)			{tmpMoveX=4; tmpMoveY=4;}
					}else{
						if(ratio>12)			{tmpMoveX=0; tmpMoveY=6;}
						if(ratio<=12 && ratio>4.5)	{tmpMoveX=1; tmpMoveY=6;}
						if(ratio<=4.5 && ratio>2.33)	{tmpMoveX=2; tmpMoveY=6;}
						if(ratio<=2.33 && ratio>1.33)	{tmpMoveX=3; tmpMoveY=5;}
						if(ratio<=1.33)			{tmpMoveX=4; tmpMoveY=4;}
					}

					/*gestion X*/
					if(cows[i][0]==cows[i][4])							{/*Pas bouger!!*/}													/*Si la vache est arrivée à destination*/
					else if(cows[i][0]+(tmpMoveX*absMoveX)>backgroundWidth-(leftMargin+cowMargin)){cows[i][0]=backgroundWidth-(leftMargin+cowMargin);cows[i][4]=backgroundWidth-(leftMargin+cowMargin);}			/*Si le chien arrive près du bord droit*/
					else if(cows[i][0]+(tmpMoveX*absMoveX)<cowMargin)				{cows[i][0]=cowMargin;cows[i][4]=cowMargin;}										/*Si le chien arrive près du bord gauche*/
					else if(cows[i][0]<cows[i][4] && cows[i][0]+(tmpMoveX*absMoveX)>cows[i][4])	{cows[i][0]=cows[i][4];}												/*Si le chien arrive à destination*/
					else if(cows[i][0]>cows[i][4] && cows[i][0]+(tmpMoveX*absMoveX)<cows[i][4])	{cows[i][0]=cows[i][4];}												/*Si le chien arrive à destination*/
					else										{cows[i][0]=cows[i][0]+(tmpMoveX*absMoveX);}										/*Sinon on bouge*/
			


					/*gestion Y*/
					if(cows[i][1]==cows[i][5])							{/*Pas bouger!!*/}													/*Si le chien est arrivé à destination*/
					else if(cows[i][1]+(tmpMoveY*absMoveY)<topMargin+cowMargin)			{cows[i][1]=topMargin+cowMargin;cows[i][5]=topMargin+cowMargin;}							/*Si le chien est arrivé près du bord haut*/
					else if(cows[i][1]+(tmpMoveY*absMoveY)>backgroundHeight-cowMargin)		{cows[i][1]=backgroundHeight-cowMargin;cows[i][5]=backgroundHeight-cowMargin;}						/*Si le chien est arrivé près du bord bas*/
					else if(cows[i][1]<cows[i][5] && cows[i][1]+(tmpMoveY*absMoveY)>cows[i][5])	{cows[i][1]=cows[i][5];}												/*Si le chien arrive à destination*/
					else if(cows[i][1]>cows[i][5] && cows[i][1]+(tmpMoveY*absMoveY)<cows[i][5])	{cows[i][1]=cows[i][5];}												/*Si le chien arrive à destination*/
					else										{cows[i][1]=cows[i][1]+(tmpMoveY*absMoveY);}
				}

				if(cows[i][0]==cows[i][4] && cows[i][1]==cows[i][5]){cows[i][3]=0;}

			}
		}
	}
/*####################################################*/
	function animBull(){
		/*move the bull fom position to destination*/	


	}


/*+++++++++++++++++++++++++++++++++++++++++++++++*/
/*++++++++++++++++      DRAW      +++++++++++++++*/
/*+++++++++++++++++++++++++++++++++++++++++++++++*/

	/*####################################################*/
	function drawDog(){
		$("#dog").css({'left': (dog[0]-16)+'px', 'top': (dog[1]-15)+'px'});
		$("#dog").attr("src", dogSprite[dog[3]+dog[2]*3][dog[6]]);

		if(dog[3]==2){
			$("#waf").css({'left': (dog[0]-10-16)+'px', 'top': (dog[1]-50-15)+'px'});
			$("#waf").attr("src", "images/Waff.png");			
		}else{
			$("#waf").css({'left': '0px', 'top': '0px'});
			$("#waf").attr("src", "images/Empty.png");
		}

	}

	/*####################################################*/
	function drawCow(){
		for(var i = 0; i < cows.length;i++){
			var tmpi = "00" + (i+1);
			tmpi = "cow" + tmpi.substring(tmpi.length-2);
			$("#"+tmpi).css({'left': (cows[i][0]-28)+'px', 'top': (cows[i][1]-22)+'px'});
			$("#"+tmpi).attr("src",cowSprite[cows[i][3]+cows[i][2]*4][cows[i][6]]);
		}
	}

	/*####################################################*/
	function drawMeuh(){
		if(meuh<cows.length){
			$("#meuh").css({'left': (cows[meuh][0]+15-28) + 'px', 'top': (cows[meuh][1]-20-22) + 'px'});
			$("#meuh").attr("src", "images/Meuh.png");			
		}else{
			$("#meuh").css({'left': '0px', 'top': '0px'});
			$("#meuh").attr("src", "images/Empty.png");
		}
	}

	/*####################################################*/
	function drawBull(){
		for(var i = 0; i < bulls.length;i++){
			var tmpi = "00" + (i+1);
			tmpi = "bull" + tmpi.substring(tmpi.length-2);
			$("#"+tmpi).css({'left': bulls[i][0]+'px', 'top': bulls[i][1]+'px'});
			$("#"+tmpi).attr("src",bullSprite[bulls[i][3]+bulls[i][2]*2][bulls[i][6]]);
		}
	}
});


