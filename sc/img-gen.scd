
(
m = NetAddr("localhost", 41234);// local machine
)

m.sendMsg("/iniciar", 1);

m.sendMsg("/switchHydra",0);
m.sendMsg("/cubos", 1);
m.sendMsg("/bloom", 1);
m.sendMsg("/sph", 0);
m.sendMsg("/retroB", 1);
m.sendMsg("/camX", 100);
m.sendMsg("/camY", 200);
m.sendMsg("/camZ", 1);
m.sendMsg("/mX", 1000)
m.sendMsg("/mY", 10);
m.sendMsg("/osci", 4);
m.sendMsg("/kal", 1);
m.sendMsg("/voro", 5);
m.sendMsg("/vorvel", 0.5);
m.sendMsg("/ang", 10);
m.sendMsg("/rotvel", 0.1);
m.sendMsg("/mod", 1000);
m.sendMsg("/scl", 0.45);
m.sendMsg("/sclX", 1.05);
m.sendMsg("/sclY", 0.95);
m.sendMsg("/sat", 1);
m.sendMsg("/bamboo", 1);

m.sendMsg("/meshFinal", 1);

n = NetAddr("localhost", 57120);// local machine


OSCdef(\test, {|msg, time, addr, recvPort| msg[1].postln}, '/regreso', nil);

Array

(
OSCdef( \camX, {|msg|
	var data = msg[3];
	m.sendMsg("/camX", data);
}, '/camXDef');
~camXSend = {SendReply.kr(Impulse.kr(~tempo*60), '/camXDef', ~camX.kr)};
~camX = {Lag.kr(Demand.kr(Impulse.kr(1*~tempo*0.5), 0, Drand([0,1, 10, 200, -200, 400, -350, 600, 789]*0.5,inf)), 2)};
)



OSCdef(\camX).free;

(
OSCdef( \camY, {|msg|
	var data = msg[3];
	m.sendMsg("/camY", data);
}, '/camYDef');
~camYSend = {SendReply.kr(Impulse.kr(~tempo*60), '/camYDef', ~camY.kr)};
~camY = {Lag.kr(Demand.kr(Impulse.kr(1*~tempo), 0, Drand([0,1, 10, 200, -200, 400, -350]*0.5,inf)), 2)};
)

OSCdef(\camX).free;

(
OSCdef( \camZ, {|msg|
	var data = msg[3];
	m.sendMsg("/camZ", data);
}, '/camZDef');
~camZSend = {SendReply.kr(Impulse.kr(~tempo*60), '/camZDef', ~camZ.kr)};
~camZ = {Lag.kr(Demand.kr(Impulse.kr(1*~tempo), 0, Drand([0,1, 10, 200, -200, 400, -350]*0.5,inf)), 2)};
)

OSCdef(\camZ).free;

(
OSCdef( \switchHydra, {|msg|
	var data = msg[3];
	m.sendMsg("/switchHydra", data);
}, '/shDef');
~shSend = {SendReply.kr(Impulse.kr(~tempo*0.25), '/shDef', ~sh.kr)};
~sh = {Demand.kr(Impulse.kr(1*~tempo), 0, Drand([0, 1, 2, 3, 4, 5, 6, 7, 7, 7, 7, 7, 7, 7],inf))};
)

OSCdef(\switchHydra).free;

(
OSCdef( \mX, {|msg|
	var data = msg[3];
	m.sendMsg("/mX", data);
}, '/mXDef');
~mXSend = {SendReply.kr(Impulse.kr(~tempo*60), '/mXDef', ~mX.kr)};
~mX = {Lag.kr(Demand.kr(Impulse.kr(2*~tempo), 0, Drand([1000,200, -345, 800, 0, -1000],inf)), 4)};
)

OSCdef(\mX).free;

(
OSCdef( \mY, {|msg|
	var data = msg[3];
	m.sendMsg("/mY", data);
}, '/mYDef');
~mYSend = {SendReply.kr(Impulse.kr(~tempo*60), '/mYDef', ~mY.kr)};
~mY = {Lag.kr(Demand.kr(Impulse.kr(5*~tempo), 0, Drand([1, 20, 30, 50, 80, -80, -60, -20, -1]*0.125,inf)), 4)};
)

OSCdef(\mX).free;