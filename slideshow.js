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
        if (this.percentage) this.percentage()

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
            this.items[this.active].classList.remove('active')
            this.items[index].classList.remove('sliding', this.animations[rand])
            this.items[index].classList.add('active')
            this.active = index
            this.sliding = false
            if(this.onchange) this.onchange()
          }, this.duration)

        } else {
          this.items[this.active].style.display = 'none'
          this.active = index
          this.items[index].classList.add('active')
          this.items[this.active].style.display = 'block'
          if(this.onchange) this.onchange()
        }

      }
    }

    next () {
      var index = (this.active + 1) % this.items.length
      this.show(index)
    }

    prev () {
      var index = this.active - 1
      if (index < 0) index = this.items.length - 1
      this.show(index)
    }

    play () {
      this.paused = false
      if (this.loop) return
      var interval = 50
      this.loop = setInterval(() => {
        if (this.paused) return
        if (this.pauseOnHover && this.isHover) return
        this.timer += interval
        if (this.timer > this.interval) this.next()
        if (this.percentage) this.percentage()
      }, interval)
    }

    pause () {
      this.paused = true
    }

    stop () {
      this.timer = 0
      clearInterval(this.loop)
      this.loop = null
      if (this.percentage) this.percentage()
    }

    setEvents () {
      this.el.addEventListener('mouseover', setHover.bind(this))
      this.el.addEventListener('mouseout', unsetHover.bind(this))
      swipedetect.bind(this.el)(dir => {
        if(dir == 'left') this.next()
        if(dir == 'right') this.prev()
      })
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

  function swipedetect(callback){

    var touchsurface = this,
    swipedir,
    startX,
    startY,
    distX,
    distY,
    threshold = 80,
    restraint = 100,
    allowedTime = 300,
    elapsedTime,
    startTime,
    handleswipe = callback || function(swipedir){}

    touchsurface.addEventListener('touchstart', function(e){
      var touchobj = e.changedTouches[0]
      swipedir = 'none'
      startX = touchobj.pageX
      startY = touchobj.pageY
      startTime = new Date().getTime()
      // e.preventDefault()
    }, false)

    // touchsurface.addEventListener('touchmove', function(e){
    //   e.preventDefault() // prevent scrolling when inside DIV
    // }, false)

    touchsurface.addEventListener('touchend', function(e){
      var touchobj = e.changedTouches[0]
      distX = touchobj.pageX - startX
      distY = touchobj.pageY - startY
      elapsedTime = new Date().getTime() - startTime
      if (elapsedTime <= allowedTime){
        if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){
          swipedir = (distX < 0)? 'left' : 'right'
        }
        else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){
          swipedir = (distY < 0)? 'up' : 'down'
        }
      }
      handleswipe(swipedir)
      // e.preventDefault()
    }, false)
  }

  window.Slideshow = Slideshow


})()
