const selects = document.querySelectorAll('.request__select')

selects.forEach(select => {
  const button = select.querySelector('button')
  const options = select.querySelectorAll('li')
  const valueLabel = select.querySelector('.value')
  const placeholder = select.querySelector('.placeholder')

  button.addEventListener('click', (e) => {
    e.preventDefault()

    select.classList.toggle('active')
  })

  options.forEach(option => {
    option.addEventListener('click', (event) => {
      const value = event.target.textContent
      valueLabel.textContent = value
      select.setAttribute('value', value.trim())
      select.querySelector('input').value = value
      select.closest('.form-group').classList.remove('has-error')
      select.classList.remove('active')

      if (valueLabel.textContent.trim().length) {
        placeholder.style.display = 'none'
        valueLabel.style.display = 'block'
      }
    })
  })
})

window.addEventListener('click', (e) => {
  if (!e.target.closest('.request__select')) {
    selects.forEach(select => {
      select.classList.remove('active')
    })
  }
})

////////////////////////////////////////////

const cars = document.querySelector('.cars')
const services = document.querySelector('.services__body')
const request = document.querySelector('.request')

let photos = []
let table = []

const vinForm = document.getElementById('vinForm');
const vinInput = document.getElementById('vinInput');

vinInput.addEventListener('input', () => {
  vinInput.closest('.form-group').classList.remove('has-error')
})

async function getData(e) {
  e.preventDefault();

  document.getElementById('page-preloader').classList.remove('hidden')

  const vin = vinInput.value.trim();

  if (!vin) {
    document.getElementById('page-preloader').classList.add('hidden')
    vinInput.closest('.form-group').classList.add('has-error')
    return
  };

  try {
    const responseImgs = await fetch(`/api/vinimg?vin=${encodeURIComponent(vin)}`);
    photos = (await responseImgs.json()).photos;

    const responseTable = await fetch(`/api/table?vin=${encodeURIComponent(vin)}`);
    table = (await responseTable.json()).matches;

    render(vin)
    document.getElementById('page-preloader').classList.add('hidden')

  } catch (err) {
    vinInput.closest('.form-group').classList.add('has-error')
    document.getElementById('page-preloader').classList.add('hidden')
    console.error(err);
    cars.style.display = 'none'
    services.style.display = 'none'
    request.style.display = 'none'
  }
}

vinForm.addEventListener('submit', getData);

const carImg = (src) => `
            <div class="cars__car">
              <img src="${src}" alt="">
            </div>
            `

const serviceItem = (service) => `
              <li class="services__service services__row row hidden-xs hidden-sm">
                <div class="services__item col-md-2">
                  <img src="${service.img}" alt="">
                </div>

                <div class="services__item col-md-2">
                  <a target="_blank" href="${service.url}">${service.domain}</a>
                </div>

                <div class="services__item col-md-2">
                  <p>${service.days} дней</p>
                </div>

                <div class="services__item col-md-2">
                  <p>${service.source}</p>
                </div>

                <div class="services__item col-md-2">
                  <p>${service.price} USD</p>
                </div>
                <div class="services__item col-md-2">
                    <input id=${service.domain} type="checkbox" class="custom-checkbox" />
                </div>
              </li>
              
              <li class="services__service services__row services__row-mob visible-block hidden-md hidden-lg">
                <div class="services__subrow row">
                  <div class="services__item col-xs-4">
                    <img src="${service.img}" alt="">
                  </div>

                  <div class="services__item col-xs-4">
                    <a target="_blank" href="${service.url}">${service.domain}</a>
                  </div>

                  <div class="services__item col-xs-4">
                    <input class="custom-checkbox" id=${service.domain} type="checkbox" />
                  </div>
                </div>

                <div class="services__subrow row">
                  <div class="services__item col-xs-4">
                    <p>${service.days} дней</p>
                  </div>

                  <div class="services__item col-xs-4">
                    <p>${service.source}</p>
                  </div>

                  <div class="services__item col-md-4">
                    <p>${service.price} USD</p>
                  </div>
                </div>
        
              </li>
`

function render(vin) {
  cars.querySelector('[render]').innerHTML = ''
  services.querySelector('[render]').innerHTML = ''

  photos.forEach(photo => {
    cars.querySelector('[render]').insertAdjacentHTML('beforeend', carImg(photo));
  })

  document.querySelector('.services__code p').textContent = vin

  table.forEach(item => {
    services.querySelector('[render]').insertAdjacentHTML('beforeend', serviceItem(item));
  })

  if (photos.length) {
    cars.style.display = 'block'
  } else {
    cars.style.display = 'none'
  }

  if (table.length) {
    services.style.display = 'block'
    request.style.display = 'block'

    document.querySelectorAll('.services__service input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', () => {

        if (checkbox.checked) {
          selectServices.push(table[table.findIndex(i => i.domain === checkbox.id)])
        } else {
          selectServices = selectServices.filter(s => s.domain !== checkbox.id)
        }

        document.querySelector('.request__title .count').textContent = `Выбрано ${selectServices.length} сайтов на сумму:`
        document.querySelector('.request__title .price').textContent = `${selectServices.reduce((prev, curr) => prev + curr.price, 0)} USD`
        document.querySelector('#select-all').checked = selectServices.length === table.length
      })
    })
  } else {
    services.style.display = 'none'
    request.style.display = 'none'
  }
}

let selectServices = []
document.querySelector('#select-all').addEventListener('change', (e) => {
  if (e.target.checked) {
    selectServices = [...table]

  } else {
    selectServices = []
  }

  document.querySelectorAll('.services__service input[type="checkbox"]').forEach(checkbox => {
    checkbox.checked = selectServices.filter(s => s.domain === checkbox.id)[0]
  })

  document.querySelector('.request__title .count').textContent = `Выбрано ${selectServices.length} сайтов на сумму:`
  document.querySelector('.request__title .price').textContent = `${selectServices.reduce((prev, curr) => prev + curr.price, 0)} USD`
})

document.querySelectorAll('.request__input').forEach(input => {
  input.addEventListener('input', () => {
    input.closest('.form-group').classList.remove('has-error')
  })
})

function valid() {
  document.querySelectorAll('.request__field[required]').forEach(field => {
    if ((field.nodeName === 'INPUT' && !field.value.trim().length)
      || (field.nodeName === 'DIV' && !field.getAttribute('value').trim().length)) {
      field.closest('.form-group').classList.add('has-error')
    }
  }
  )
}

document.querySelector('.request__submit').addEventListener('click', valid)