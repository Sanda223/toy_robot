// this willl handle all the logic for the robot movements and actions

// constants for grid size and directions
const grid_size = 5;
const dir_facing = ['NORTH', 'EAST', 'SOUTH', 'WEST'];

//robots initial state
let robot = {
    x: null, 
    y: null, 
    facing: null, 
    isplaced: false

};


// function to make sure the robots position is valid
function isValidPosition(x, y) {
    return x >= 0 && x < grid_size && y >= 0 && y < grid_size;

}


//place(x, y, facing) command
export function place(x, y, facing) {
    if (!isValidPosition(x, y)) {
        return {success: false, message: 'Invalid position'};
    }

    if (!dir_facing.includes(facing)) { 
        return { success: false, message: "Invalid direction" };
    }

    robot = {
        x: x,
        y: y,
        facing: facing,
        isplaced: true
    };

    return { success: true, message: "Robot placed successfully" };
}


// move() command
export function move() {
    // do nothing if robot has not been placed yet
    if (!robot.isplaced) {
        return { success: false, message: "Robot not placed yet" };
    }

    // copy current position
    let newX = robot.x;
    let newY = robot.y;

    // change position based on direction
    if (robot.facing === 'NORTH') newY++;
    if (robot.facing === 'SOUTH') newY--;
    if (robot.facing === 'EAST') newX++;
    if (robot.facing === 'WEST') newX--;

    // check if new position is still inside the grid
    if (!isValidPosition(newX, newY)) {
        return { success: false, message: "Move would fall off the table" };
    }

    // apply the move
    robot.x = newX;
    robot.y = newY;

    return { success: true, message: "Robot moved successfully" };
}



// left() command
export function left() {
    // do nothing if robot has not been placed yet
    if (!robot.isplaced) {
        return { success: false, message: "Robot not placed yet" };
    }

    // find current direction index
    const currentIndex = dir_facing.indexOf(robot.facing);

    // move left in the directions array
    const newIndex = (currentIndex + 3) % dir_facing.length;

    // update facing direction
    robot.facing = dir_facing[newIndex];

    return { success: true, message: "Robot turned left" };
}



// right() command
export function right() {
    // do nothing if robot has not been placed yet
    if (!robot.isplaced) {
        return { success: false, message: "Robot not placed yet" };
    }

    // find current direction index
    const currentIndex = dir_facing.indexOf(robot.facing);

    // move right in the directions array
    const newIndex = (currentIndex + 1) % dir_facing.length;

    // update facing direction
    robot.facing = dir_facing[newIndex];

    return { success: true, message: "Robot turned right" };
}



// report() command
export function report() {
    // do nothing if robot has not been placed yet
    if (!robot.isplaced) {
        return { success: false, message: "Robot not placed yet" };
    }

    // return robot state as a string
    return {
        success: true,
        message: `${robot.x}, ${robot.y}, ${robot.facing}`
    };
}



// Takes a raw string command and runs the matching function
export function executeCommand(raw) {
  const input = String(raw || "").trim();
  if (!input) return { success: false, message: "Empty command" };

  const cmd = input.toUpperCase();

  // PLACE(x,y,facing)  (accepts spaces, optional quotes)
  const m = cmd.match(
      /^PLACE\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*["']?([A-Z]+)["']?\s*\)\s*$/
  );
  if (m) {
    const x = parseInt(m[1], 10);
    const y = parseInt(m[2], 10);
    const facing = m[3];
    return place(x, y, facing);
  }

  if (cmd === "MOVE" || cmd === "MOVE()") return move();
  if (cmd === "LEFT" || cmd === "LEFT()") return left();
  if (cmd === "RIGHT" || cmd === "RIGHT()") return right();
  if (cmd === "REPORT" || cmd === "REPORT()") return report();

  return { success: false, message: `Unknown command: ${input}` };
}



// used by the UI to draw the robot on the grid
export function getRobot() {
  return { ...robot };
}
