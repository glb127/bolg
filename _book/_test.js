function old_f(gz,gz_gjj,gz_sb) {
  var qz=3500,li=0,gjj_max=24311,sb_max=21980;
  if(!gz_gjj){
    gz_gjj=gz;
  }
  if(!gz_sb){
    gz_sb=gz;
  }
  var shuilv={//2313
    1500:0.03,  //0
    4500:0.1,   //105
    9000:0.2,   //555
    35000:0.25, //1005
    55000:0.3,  //2755
    80000:0.35, //5505
    10000000:0.45//13505
  }
  var l=gz-Math.min(gz_sb,sb_max)*0.105-Math.min(gz_gjj,gjj_max)*0.12;
  var old=0;
  for(var ent in shuilv){
    if((l-qz)>ent){
      li+=(ent-old)*shuilv[ent];
    }else{
      li+=(l-qz-old)*shuilv[ent]
      break;
    }
    old=ent;
  }
  var gjj=Math.min(gz_gjj,gjj_max)*0.24;
  console.log("老的:税:"+~~li,"到手:"+~~(l-li),"公积金:"+~~gjj,"实得:"+~~(l-li+gjj))
}

function new_f(gz,gz_gjj,gz_sb) {
  var qz=5000,li=0,gjj_max=24311,sb_max=21980;
  if(!gz_gjj){
    gz_gjj=gz;
  }
  if(!gz_sb){
    gz_sb=gz;
  }
  var shuilv={
    3000:0.03,  //0
    12000:0.1,  //210
    25000:0.2,  //1410
    35000:0.25, //2660
    55000:0.3,  //4410
    80000:0.35, //7160
    10000000:0.45//15160
  }
  var l=gz-Math.min(gz_sb,sb_max)*0.105-Math.min(gz_gjj,gjj_max)*0.12;
  var old=0;
  for(var ent in shuilv){
    if((l-qz)>ent){
      li+=(ent-old)*shuilv[ent];
    }else{
      li+=(l-qz-old)*shuilv[ent]
      break;
    }
    old=ent;
  }
  var gjj=Math.min(gz_gjj,gjj_max)*0.24;
  console.log("新的:税:"+~~li,"到手:"+~~(l-li),"公积金:"+~~gjj,"实得:"+~~(l-li+gjj))
  return ~~(l-li+gjj);
}
var gz=20800
var old_get=old_f(gz,gz,gz*0.7);
var new_get=new_f(gz,gz,gz*0.7);

