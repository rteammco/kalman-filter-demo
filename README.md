# Kalman Filter Demo

This is an HTML5 Canvas + React implementation of a Kalman Filter simulation. A Kalman filter can be used to predict the current and future state of a system where the sensor may be experiencing a lot of input noise.

This demo simulates a ball being observed by a camera (or some other sensor). The ground truth position of the ball is determined by the user's cursor position, and random noise is added. The Kalman Filter is then run on the noisy position reading to give an estimated position. If prediction is enabled, the Kalman Filter can also predict the where the ball will be after _n_ seconds given the current sensor reading.

## Running the Code

This project is built with React + TypeScript.

1. `git clone git@github.com:rteammco/kalman-filter-demo.git`
2. `cd kalman-filter-demo`
3. `npm i`
4. `npm run start`

This runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## How This Demo Works

#### Basic Controls

- Move your mouse cursor around the black canvas screen. The soccer ball will follow your cursor position. This is the **ground truth** position of the ball.
- You can click anywhere in the canvas area to lock the ball's position. Click again to make the ball follow your cursor again.
- Click _START SIMULATION_ to start the Kalman Filter. Once it is running, you can click _PAUSE_ or _RESUME_ to toggle the Kalman Filter simulation on or off. You can still move the ball around even when the simulation is off.

#### The Kalman Filter

- The green circle represents the Kalman Filter's estimate of the ball's position.
- If the _Show Prediction_ checkbox is enabled, the faded soccer ball represents the Kalman Filter's predicted **future** position of the ball in _n_ seconds, where _n_ is adjusted with the _Prediction_ slider.
- You can control the amount of simulated sensor noise by moving the _Noise_ slider.
- The matrix values for matrices _A_, _H_, _Q_, and _R_ can be individually adjusted. Simply edit any of the values in any cell and it will update in the simulation in real time.
- Matrix _B_ is the control matrix, which is disabled for this simulation. The control matrix does not apply here since we're only simulating a sensor and have no control over the ball itself.
