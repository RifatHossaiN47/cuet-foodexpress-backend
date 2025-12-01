# create a python gui for turtle 2d graphics

import tkinter as tk
from tkinter import ttk
import turtle

class TurtleApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Turtle Graphics")
        self.geometry("800x600")

        # create a canvas to draw on
        self.canvas = tk.Canvas(self, bg="white")
        self.canvas.pack(fill=tk.BOTH, expand=True)

        # create a turtle object
        self.turtle = turtle.RawTurtle(self.canvas)
        self.turtle.speed(1)  # set the speed of the turtle

        # create buttons to control the turtle
        self.create_buttons()

    def create_buttons(self):
        frame = ttk.Frame(self)
        frame.pack(side=tk.BOTTOM)

        btn_forward = ttk.Button(frame, text="Forward", command=self.move_forward)
        btn_forward.grid(row=0, column=0, padx=5, pady=5)

        btn_backward = ttk.Button(frame, text="Backward", command=self.move_backward)
        btn_backward.grid(row=0, column=1, padx=5, pady=5)

        btn_left = ttk.Button(frame, text="Left", command=self.turn_left)
        btn_left.grid(row=0, column=2, padx=5, pady=5)

        btn_right = ttk.Button(frame, text="Right", command=self.turn_right)
        btn_right.grid(row=0, column=3, padx=5, pady=5)

    def move_forward(self):
        self.turtle.forward(10)

    def move_backward(self):
        self.turtle.backward(10)

    def turn_left(self):
        self.turtle.left(90)

    def turn_right(self):
        self.turtle.right(90)

# Create an instance of the TurtleApp class
app = TurtleApp() 

