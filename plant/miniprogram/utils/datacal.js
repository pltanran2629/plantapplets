module.exports={
  getDaysBetween:getDaysBetween
}

function  getDaysBetween(date1){
  // console.log(new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate())
  var  startDate = Date.parse(date1);
  var  endDate = Date.parse(new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate());
  wx.getSystemInfo({
    success: (result) => {
      if(result.system.substring(0,3)=='iOS'){
        endDate= Date.parse(new Date((new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate()).replace(/-/g, '/')));
      }
    },
  })
  // console.log(startDate)
  // console.log(endDate)
  if (startDate>=endDate){
      return "今天";
  }
  var days=parseInt(Math.abs(endDate - startDate) / 1000 / 60 / 60 /24);
  if(days==0){
    return "昨天";
  }
  if(days==1){
    return "前天";
  }
  if(days==2){
    return "3天前";
  }
  if(days==3){
    return "4天前";
  }
  if(days==4){
    return "5天前";
  }
  if(days==5){
    return "6天前";
  }
  if(days==6){
    return "7天前";
  }
  if(days/7){
    return parseInt(days/7)+"周前"
  }
}
