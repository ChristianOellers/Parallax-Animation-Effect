/* global jQuery */

/**
 * Window resize based parallax animation.
 *
 * Concept / features
 * - Do a parallax on window width resizing only (no scrolling, gestures or mouse control).
 * - On-top layers show more of the effect, but you can set that manually ('data-depth').
 * - Show effect between min/max values only. Values depend on layout and image sizes.
 * - Animation is mostly variable and combined with CSS transitions.
 */
jQuery(document).ready(($) => {
  const dampening = 0.8; // Dampen total shift for fine controlling smoother animations. Values: 0-1.
  const shiftMax = 200; // Base amount of pixels a layer can shift (multiplied by depth and dampening).
  const maxWidth = 1900; // 1900px window width =   0% parallax shift
  const minWidth = 1000; // 1000px window width = 100% parallax shift
  const maxDifference = maxWidth - minWidth; // 100% difference (= 100% parallax) for calculation.

  // Private (auto values)
  const win = $(window); // Cache window object.
  const layers = $('.inner'); // Parallax layer elements with 'data-depth' attribute.
  let shiftPercentage = 0; // How many percent the view may shift.
  let width = 0; // Current window width, except browser scrollbar.

  /**
   * Set percentage value for layer shifting ...
   * - if current window is smaller than the layer width (else disable the effect).
   * - if window size is above the minimum (else disable the effect).
   */
  function updateLayerShift() {
    if (maxWidth > width && width > minWidth) {
      shiftPercentage = (((maxWidth - width) * 100) / maxDifference) | 0;
      shiftPercentage /= 100;
    }

    if (shiftPercentage <= 0.1) {
      shiftPercentage = 0;
    }
  }

  /**
   * Update parallax effect for each layer and shift active layers to the left side.
   */
  function updateLayerPosition() {
    layers.each(function eachLayer() {
      const depth = this.dataset.depth | 0;
      const shiftValue = -(shiftMax * shiftPercentage * depth * dampening) | 0;

      if (shiftValue < 0) {
        this.style.marginLeft = `${shiftValue}px`;
      }
    });
  }

  /**
   * Listen to window size updates and update the animation.
   *
   * If performance is critical , the timeouts should be used.
   * But in this case the animation by its nature works
   * only for resizeable desktop browsers, so we can omit it.
   */
  win.on('resize', () => {
    width = win.width();

    updateLayerShift();
    updateLayerPosition();
  });
});
