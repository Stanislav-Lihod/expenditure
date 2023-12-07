const totalNumber = document.getElementById('total-number'),
      salaryTanya = document.getElementById('salary-tanya'),
      salaryStas = document.getElementById('salary-stas'),
      bankButtons = document.querySelectorAll('.personal-count__item-bottom > div'),
      currentMonth = new Date().getMonth() + 1

      
let lsObject = {
  stas:{
    salary: 1512.5,
    generalBank: false,
    savingsAccount: false,
    personalBank: undefined
  },
  tanya:{
    salary: 870.9,
    generalBank: false,
    savingsAccount: false,
    tax: false,
    personalBank: undefined
  },
  month: currentMonth,
  totalNumber: 1840
}

if (!localStorage.generalInfo) {
  localStorage.generalInfo = JSON.stringify(lsObject)
} 

(function parseLS(){
  const currentInfo = JSON.parse(localStorage.generalInfo);
  
  if (currentMonth !== currentInfo.month) {
    lsObject.month = currentMonth
    lsObject.totalNumber = currentInfo.totalNumber
    localStorage.generalInfo = JSON.stringify(lsObject)
  } else{
    lsObject = currentInfo
    salaryTanya.value = currentInfo.tanya.salary
    salaryStas.value = currentInfo.stas.salary
    totalNumber.textContent = `${currentInfo.totalNumber} ${totalNumber.getAttribute('data-curency')}`

    for (const i in lsObject) {
      const item = document.getElementById(i)
      for (const personData in lsObject[i]) {
        if (lsObject[i][personData] === true) {
          item.querySelector(`.${personData}`).classList.remove('hide')
          item.querySelector(`.${personData}`).classList.add('active')
        }

        if (Number(lsObject[i]['personalBank'])) {
          const personBank = item.querySelector('.personalBank')
          personBank.classList.remove('hide')
          if (lsObject[i]['personalBank'] !== true) {
            personBank.querySelector('span').textContent = lsObject[i]['personalBank']
            personBank.setAttribute('data-number', lsObject[i]['personalBank'])
          }
        }
      }
    }
  }  
})()

salaryTanya.addEventListener('keyup',(e)=>{
  addLocalStorageSalary(e.target.value, 'tanya')
})
salaryStas.addEventListener('keyup',(e)=>{
  addLocalStorageSalary(e.target.value, 'stas')
})

bankButtons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    if (!btn.classList.contains('active')) {
      const parent = btn.closest('.personal-count__item'),
            blockInput = parent.querySelector('input'),
            personName = parent.getAttribute('data-name'),
            btnType = btn.classList[0]
            
      if (Number(blockInput?.value) > 0) {
        const numberBlock = Number(btn.getAttribute('data-number')),
              currentValue = Number(blockInput?.value);
        
        if (btn.classList.contains('savingsAccount')) {
          totalNumber.textContent = btn.classList.contains('active') ? `${lsObject.totalNumber - numberBlock}` : `${lsObject.totalNumber + numberBlock}`
          lsObject.totalNumber = Number(totalNumber.textContent)
          addLocalStorage()
          
          totalNumber.textContent += ` ${totalNumber.getAttribute('data-curency')}`
        }
        
        blockInput.value = btn.classList.contains('active') ? (currentValue + numberBlock).toFixed(2) : (currentValue - numberBlock).toFixed(2)
        addLocalStorageSalary(blockInput.value, personName)
        btn.classList.toggle('active')

        lsObject[personName][btnType] = true
        addLocalStorage()
        
        if(!JSON.stringify(lsObject[personName]).includes('false') && !btn.classList.contains('personalBank')){
          const personalBank = btn.closest('.personal-count__item-bottom').querySelector('.hide')
          personalBank.classList.remove('hide')
          personalBank.querySelector('span').textContent = Number(blockInput?.value)
          personalBank.setAttribute('data-number', blockInput?.value)
          lsObject[personName]['personalBank'] = Number(blockInput?.value)
          addLocalStorage()
        }
      }
    }
  })
})

function addLocalStorageSalary(value, person){
  lsObject[person].salary = Number(value)
  addLocalStorage()
}

function addLocalStorage(){
  localStorage.generalInfo = JSON.stringify(lsObject)
}
