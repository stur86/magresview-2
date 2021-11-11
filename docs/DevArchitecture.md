### MagresView 2.0: Software Architecture


```
                                                   Context.Provider
                        +---------------------------------------------------------------------+
                        |                                                                     |
                        v                                                                     |
    +-----------------------+                   +-----------------------------------------+   |
    |                       |                   |                                         |   |
    | +-------------------+ |  Context.Provider |              MagresViewHeader           |   |
    | |     MVStore       | |<----------------->|                                         |   |
    | |                   | |                   +---------------------------+-------------+   |
    | +-------------------+ |                   |                           |             |   |
    |                       |                   |                           |             |   |
    |    MVInterface        |                   |                           |             |<--+
    |                       |                   |                           |             |
    +---+-------------------+                   |                           |             |
        |               ^                       | <canvas id="mv-appwindow">| MVSidebar...|
Controls|         Events|                       |                           |             |
        v               |                       |                           |             |
    +-------------------+---+  Renders to       |                           |             |
    |                       +-----------------> |                           |             |
    |       CrystVis        |                   |                           |             |
    +-----------------------+                   +-------+-------------------+-------------+
                 ^                                      |
                 |           Input callbacks            |
                 +--------------------------------------+
```

The figure above represents the general structure of the MagresView 2.0 app. The box on the right
represents the actual GUI which is rendered to the page, and the components that make it up, 
whereas the boxes on the left are purely coding objects that don't actually have a corresponding
graphical representation. 

The flow of the process can be described as follows:

1. the **MVStore** holds all the relevant state information for the app, which includes both loaded data and user settings;
2. the **MVStore** is not directly visible, and instead interactions with it are always mediated through the **MVInterface** and its children, which provide methods and setters/getters to access it in a more intuitive way. It's important that the **MVInterface** never holds state on its own: it only provides method that read or dispatch to the state of the **MVStore**;
3. the **MVInterface** is used to initialise the **CrystVis** app, from library `crystvis.js`, which handles the low level loading and rendering of atomic structures;
4. the **CrystVis** app communicates with the rest of the app in two ways: through the canvas `mv-appwindow`, to which it renders the 3D model and from which it can receive input in the form of callbacks (e.g. a user clicks on an atom), and through the MVInterface, which can set its parameters and read its data, or be the target for specific event callbacks (e.g. in case the selected atoms change)
5. the **MagresViewHeader** and the various **MVSidebar...** components handle the bulk of the user input. They can edit the state of the app only through the **MVInterface**, to which they receive a reference through a React Context Provider.