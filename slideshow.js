/*!
 * Slideshow.js v0.0.1
 * (c) 2017 Carlos Duran
 */

(function () {

  const defaults = {
    el: '.slideshow',

    // Auto
    auto: false,
    interval: 5000,
    pauseOnHover: false,
    random: false,

    // Animation
    animations: [],
    animationsOut: [],
    duration: 500
  }

  class Slideshow {

    constructor (opts) {
      Object.assign(this, defaults, opts)
      if (!this.validate()) return
      this.init()
      if (this.auto) this.play()
      this.setEvents()
    }

    validate () {
      if (!this.el) {
        if (this.debug) console.log('Should specify an element')
        return false
      }

      return true
    }

    init () {
      this.el = document.querySelector(this.el)
      this.items = Array.from(this.el.children)
      if (this.active !== undefined) {
        this.active = this.active % this.items.length
      } else {
        let activeIndex = this.items.findIndex(i => (i.classList.contains('active')))
        this.active = activeIndex > -1 ? activeIndex : 0
      }

      this.interval = this.interval < this.duration ? this.duration : this.interval

      this.items.forEach((item, i) => {
        item.style.display = i !== this.active ? 'none' : 'block'
        item.style.animationDuration = (this.duration * 1.0 / 1000) + 's'
      })

      // Status
      this.sliding = false
      this.paused = false
      this.timer = 0

      if (this.onready) this.onready()
      if (this.onchange) this.onchange()
    }

    show (index) {
      if (index > -1 && index < this.items.length && index !== this.active && !this.sliding) {
        this.timer = 0

        this.items.forEach((item, i) => {
          item.style.display = i !== this.active ? 'none' : 'block'
        })

        if (this.animations.length) {
          this.sliding = true
          this.items.forEach(i => {
            i.classList.remove(...this.animations, ...this.animationsOut)
          })

          var rand = Math.floor(Math.random() * this.animations.length)
          var randOut = Math.floor(Math.random() * this.animationsOut.length)

          this.items[index].classList.add('sliding', this.animations[rand])
          this.items[index].style.display = 'block'

          if (this.animationsOut.length) {
            this.items[this.active].classList.add(this.animationsOut[randOut])
          }

          setTimeout(() => {
            this.items[this.active].style.display = 'none'
            this.items[index].classList.remove('sliding', this.animations[rand])
            this.active = index
            this.sliding = false
          }, this.duration)

        } else {
          this.items[this.active].style.display = 'none'
          this.active = index
          this.items[this.active].style.display = 'block'
        }

        if(this.onchange) this.onchange()
      }
    }

    next () {
      var index = (this.active + 1) % this.items.length
      this.show(index)
    }

    prev () {
      var index = this.active - 1
      if (index < 0) index = this.items.length - 1
      this.show(index, true)
    }

    play () {
      if (this.loop) return
      var interval = 50
      this.paused = false
      this.loop = setInterval(() => {
        if (this.paused) return
        if (this.pauseOnHover && this.isHover) return
        this.timer += interval
        if (this.timer > this.interval) this.next()
        if (this.percentaje) this.percentaje()
      }, interval)
    }

    pause () {
      this.paused = !this.paused
    }

    stop () {
      this.timer = 0
      clearInterval(this.loop)
      this.loop = null
      if (this.percentaje) this.percentaje()
    }

    setEvents () {
      this.el.addEventListener('mouseover', setHover.bind(this))
      this.el.addEventListener('mouseout', unsetHover.bind(this))
    }

    removeEvents () {
      this.el.removeEventListener('mouseover', setHover.bind(this))
      this.el.removeEventListener('mouseout', unsetHover.bind(this))
    }
  }

  function setHover () {
    this.isHover = true
  }

  function unsetHover () {
    this.isHover = false
  }

  window.Slideshow = Slideshow

})()
