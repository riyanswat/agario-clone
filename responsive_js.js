class AgarioClone {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.grid_size = 16;
    this.min_cell_radius = 25; //minimum cell radius
    this.max_cell_radius = 500; //max radius (i.e. how big the cell can get)
    this.cell_radius = this.min_cell_radius; //start the player with the min radius
    this.cell_colour = get_random_colour();

    this.cell_x = this.canvas.width / 2;
    this.cell_y = this.canvas.height / 2;
    this.cursor_x = this.cell_x;
    this.cursor_y = this.cell_y;
    this.delay = 0.01; //in seconds
    this.smootheness = 0.02;

    this.food_array = []; //for food objects
    this.food_size = 6;
    this.food_spawn_delay = 700; //in ms

    this.canvas.addEventListener(
      "mousemove",
      this.handle_mouse_move.bind(this)
    );
    
    //////////
    // window resizing
    window.addEventListener("resize", this.handle_window_resize.bind(this));
    this.handle_window_resize(); // Initial calculation of the grid
    //////////
    
    this.game_loop();
    this.cursor_loop();
    setInterval(this.spawn_food.bind(this), this.food_spawn_delay); //spawn food slowly
  }

  
  ////////////
  handle_window_resize() {
    // update canvas size to match screen size
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // recalculate the grid size based on new canvas size
    this.grid_size = Math.min(this.canvas.width, this.canvas.height) / 20; // change the 20 to change the number of grid lines
  }
  ////////////
  

  draw_grid() {
    this.ctx.strokeStyle = "#ddd";
    for (let x = 0; x < this.canvas.width; x += this.grid_size) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.canvas.height; y += this.grid_size) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  draw_cell() {
    this.ctx.beginPath();
    this.ctx.arc(this.cell_x, this.cell_y, this.cell_radius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.cell_colour; //cell colour can also be adjusted here
    this.ctx.fill();
    this.ctx.closePath();
  }

  draw_food() {
    this.food_array.forEach((food) => {
      this.ctx.beginPath();
      this.ctx.arc(food.x, food.y, this.food_size, 0, Math.PI * 2);
      this.ctx.fillStyle = food.colour;
      this.ctx.fill();
      this.ctx.closePath();
    });
  }

  clear_canvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  update_cursor() {
    const dx = this.cell_x - this.cursor_x;
    const dy = this.cell_y - this.cursor_y;
    this.cursor_x += dx * this.delay;
    this.cursor_y += dy * this.delay;
  }

  update() {
    this.clear_canvas();
    this.draw_grid();
    this.update_cell();
    this.draw_cell();
    this.draw_food();
  }

  update_cell() {
    const dx = this.cursor_x - this.cell_x;
    const dy = this.cursor_y - this.cell_y;
    this.cell_x += dx * this.smootheness;
    this.cell_y += dy * this.smootheness;

    // Limit the player size to the maximum and minimum radius
    this.cell_radius = Math.max(
      this.min_cell_radius,
      Math.min(this.cell_radius, this.max_cell_radius)
    );
  }

  handle_mouse_move(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.cursor_x = event.clientX - rect.left;
    this.cursor_y = event.clientY - rect.top;
  }

  spawn_food() {
    if (this.food_array.length < 40) {
      const x = Math.floor(Math.random() * this.canvas.width);
      const y = Math.floor(Math.random() * this.canvas.height);
      const colour = get_random_colour();
      this.food_array.push({ x, y, colour });
    }
  }

  remove_eaten_food() {
    this.food_array = this.food_array.filter((food) => {
      const dx = this.cell_x - food.x;
      const dy = this.cell_y - food.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= this.cell_radius + this.food_size) {
        // The player ate the food
        this.cell_radius += 1; // Adjust the amount by which the player grows
        return false; // Remove the food from the array
      }

      return true; // Keep the food in the array
    });

    // Limit the player size to the maximum and minimum radius
    this.cell_radius = Math.max(
      this.min_cell_radius,
      Math.min(this.cell_radius, this.max_cell_radius)
    );
  }

  game_loop() {
    this.update();
    this.remove_eaten_food(); // Check if the player ate any food
    requestAnimationFrame(this.game_loop.bind(this));
  }

  cursor_loop() {
    this.update_cursor();
    requestAnimationFrame(this.cursor_loop.bind(this));
  }
}

function get_random_colour() {
  const chars = "0123456789ABCDEF";
  let colour = "#";
  for (let i = 0; i < 6; i++) {
    colour += chars[Math.floor(Math.random() * 16)];
  }
  return colour;
}

const agario_clone = new AgarioClone("game-canvas");
