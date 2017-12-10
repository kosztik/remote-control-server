import { MouseActions } from '../PropTypes'
import React from 'react'
import _ from 'lodash'

export default class Mouse extends React.PureComponent {
  static propTypes = {
    MouseActions
  }
  constructor ({ throttle = 10 }) {
    super()
    this.lastX = null
    this.lastY = null
    this.timeout = null
    this.handleTouchMove = _.throttle(this._handleTouchMove, throttle)
  }
  handleClick = event => {
    const { MouseActions } = this.props
    const eventButtonCode = event.button
    MouseActions.click(eventButtonCode)
  }
  handleDoubleClick = event => {
    const eventButtonCode = event.button
    this.props.MouseActions.doubleClick(eventButtonCode)
  }
  handleMouseEnter = ({ clientX, clientY }) => {
    this.lastX = clientX
    this.lastY = clientY
  }
  handleMouse = (posX, posY, scroll) => {
    const { MouseActions } = this.props
    const x = posX - this.lastX
    const y = posY - this.lastY

    if (scroll && Math.abs(y) < 5) return

    this.lastX = posX
    this.lastY = posY

    MouseActions.move({ x, y, scroll })
  }
  handleMouseMove = ({ clientX, clientY }) => {
    this.handleMouse(clientX, clientY)
  }
  handleTouchStart = (event) => {
    event.persist()
    const touch = event.touches[0]
    this.lastX = touch.clientX
    this.lastY = touch.clientY

    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => event.preventDefault(), 50)
  }
  handleTouchEnd = () => {
    clearTimeout(this.timeout)
  }
  _handleTouchMove = (event) => {
    event.preventDefault()
    const touch = event.touches[0]
    const scroll = event.touches.length > 1
    this.handleMouse(touch.clientX, touch.clientY, scroll)
  }
  render () {
    return (
      <div className='mousepad'
        onClick={this.handleClick}
        onDoubleClick={this.handleDoubleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseMove={this.handleMouseMove}
        onTouchEnd={this.handleTouchEnd}
        onTouchMove={this.handleTouchMove}
        onTouchStart={this.handleTouchStart}
      >
        <span className='icon icon-mouse' />
      </div>
    )
  }
}
