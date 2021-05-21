/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function checkCashRegister(price, cash, cid) {//price: precio del producto, cash: dinero entregado por el cliente, cid:array del cash-in-drawer
  //devuelve el estado de la caja y el arreglo con el cambio a entregar
  var changeAmount=cash-price;
  if(changeAmount>totalCid(cid)){
    return {status: "INSUFFICIENT_FUNDS",change:[]};
  }else{
    if(changeAmount===totalCid(cid)){
      return {status:"CLOSED",change:cid};
    }else{
      let changeArr=getChangeArr(changeAmount,cid);
      if(changeArr.length>0){
        return {status:"OPEN",change:depurateChangeArr(changeArr)};
      }else{
        return {status: "INSUFFICIENT_FUNDS",change:[]};
      }
    }
  }
}

function totalCid(arr){//arr:array representativo del cid
  //devuelve la cantidad de dinero en el cid
  let answer=0;
  for(let i in arr){
    switch(i){
      case 0:
        answer+=arr[0][1]*100*.01;
        break;
      case 1:
        answer+=arr[1][1]*20*.05;
        break;
      default:
        answer+=arr[i][1];
        break;
    }
  }
  return answer;
}

function getChangeArr(change,cid){//change: valor total del cambio an entregar, cid: array con el contenido en el cash-in-drawer
  //devuelve un array con la misma estructura del cid, pero solo con el cambio a entregar.
  let index=cid.length-1;
  let changeArr=[];
  if(change<100 && change>=20){
    index=7;
  }else{
    if(change<20 && change>=10){
      index=6;
    }else if(change<10 && change>=5){
      index=5;
    }else if(change<5 && change>=1){
      index=4;
    }else if(change<1 && change>=0.25){
      index=3;
    }else if(change<0.25 && change>=0.1){
      index=2;
    }else if(change<0.1 && change>=0.05){
      index=1;
    }else{
      index=0;
    }
  }
  for(let i=index;i>=0;i--){
    let amountThisBill=amountToChangeBill(change,billValue(i),cid[i][1]);
    changeArr.push([cid[i][0],amountThisBill]);
    change-=amountThisBill; 
    change=change.toFixed(2);
  }

  if(change>0.001){
    return[];
  }else{
    return changeArr;
  }
}
function depurateChangeArr(changeArr){// depura el array con el detalle del cambio eliminando los indices con valor cero
  for(let i=changeArr.length-1;i>=0;i--){
    if(changeArr[i][1]===0){
      changeArr=changeArr.slice(0,i).concat(changeArr.slice(i+1));
    }
  }
  return changeArr;
}
function amountToChangeBill(change,bill,cidBill){//change: cantidad a cambiar, bill: valor del billete a evaluar, cidBill: cantidad de dinero disponible en cid de ese billete 
   //Calcula la cantidad de dinero que se puede disminuir al cambio usando solo el valor del billete indicado en el parámetro bill 
   if(cidBill>0){
    if(bill>change){
      return 0;
    }else{
      let a = Math.floor(change/bill);
      let b = Math.floor(cidBill/bill);
      if(a<b){
        return a*bill;
      }else{
        return b*bill;
      }
    }
  }else{
    return 0;
  }
}
function billValue(index){//index: indice en el array cid
  //devuelve el valor del billete o moneda según el index indicado como parámetro  
  switch(index){
    case 0:
      return 0.01;
    case 1:
      return 0.05;
    case 2:
      return 0.1;
    case 3:
      return 0.25;
    case 4:
      return 1;
    case 5:
      return 5;
    case 6:
      return 10;
    case 7:
      return 20;
    case 8:
      return 100;
  }
}


console.log(checkCashRegister(19.5, 20, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]));
console.log("\n");
console.log(checkCashRegister(19.5, 20, [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 1], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]));
console.log("\n");
console.log(checkCashRegister(19.5, 20, [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]));
console.log("\n");
console.log(checkCashRegister(19.5, 20, [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]));
console.log("\n");
console.log(checkCashRegister(3.26, 100, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]));
