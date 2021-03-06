### MagresView 2.0: Software Architecture


```
                                                       use<Name>Interface hooks  
                            +---------------------------------------------------------------------+  
                            |                                                                     |  
                            v                                                                     |  
        +-----------------------+                   +-----------------------------------------+   |  
        |                       |                   |                                         |   |  
        | +-------------------+ |  Redux Provider   |              MagresViewHeader           |   |  
        | |     magresStore   | |<----------------->|                                         |   |  
        | |                   | |                   +---------------------------+-------------+   |  
        | +-------------------+ |                   |                           |             |   |  
        |                       |                   |                           |             |   |  
        |    Interfaces         |                   |                           |             |<--+  
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
whereas the boxes on the left are purely code objects that don't actually have a corresponding
graphical representation.

The flow of the process can be described as follows:

1. the **magresStore** is a Redux store that holds all the relevant state information for the app, which includes both loaded data and user settings;
2. interactions with the **magresStore** are always mediated through various interfaces. The important thing is that keeping these separated allows Redux to perform its magic, thus only updating components that use certain parts of the state, and not all the others (otherwise even simply unchecking a box would re-render pretty much the entire page!). The interfaces are provided through hooks like useAppInterface, useMSInterface etc., which return the relevant instance. Interfaces are meant to simply provide methods and setters/getters to access certain parts of the state in a more intuitive way. It's important that the interfaces never hold state on their own: they only provide method that read or dispatch to the state of the **magresStore**;
3. the **AppInterface** in particular is used to initialise the **CrystVis** app, from library `crystvis.js`, which handles the low level loading and rendering of atomic structures;
4. the **CrystVis** app communicates with the rest of the app in two ways: through the canvas `mv-appwindow`, to which it renders the 3D model and from which it can receive input in the form of callbacks (e.g. a user clicks on an atom), and through the interfaces, which can set its parameters and read its data, or be the target for specific event callbacks (e.g. in case the selected atoms change). A reference to the app is held in the state, and thus can be recovered from it by any interface that needs it;
5. the **MagresViewHeader** and the various **MVSidebar...** components handle the bulk of the user input. They can edit the state of the app only through the interfaces, of which they should only load the strictly necessary ones through the appropriate hooks.

#### Structure and naming conventions

**Controls**  
Found in `src/controls/`  
Naming convention: `MV<Name>`

These are all small React components designed to manage user input or show information. They all follow a few general rules:

* they hold minimal state, and only for necessary internal variables (e.g. whether a dropdown is open or not). They interact with the quantities they're supposed to control by taking them in as props, and then calling some kind of callback method when they're changed;
* their topmost element always has the `mv-control` CSS class;
* ideally, they should each have a test file testing their basic functionality.

**Sidebars**  
Found in `src/core/sidebars/`  
Naming convention: `MVSidebar<Name>`

Different possible controls that slide in and out at the right side of the page. Only one can be visible at a time, and only one of each type should be present in `MagresViewApp`, and they shouldn't be used anywhere else. Their rules are:

* they all should return a `MagresViewSidebar` component as their topmost element, and define a unique title for it; 
* they can use the use<Name>Interface hooks, but they should not use any more than strictly necessary to avoid unneeded re-renders;
* the children of the `MagresViewSidebar` component should be `div` and `span` components using classes like `mv-sidebar-block`, `mv-sidebar-row` and `sep-1` (defined in `MagresViewSidebar.css`) to keep the content ordered. This is not mandatory, just recommended. More classes like those can be created if necessary to style new sidebars; they should still be added to `MagresViewSidebar.css`.

**Store**  
Found in `src/core/store`

The `magresStore` is a Redux store, used to hold app-wide state. It is never used directly; instead, it is accessed through various interfaces, using dispatcher methods to act on its contents. There are three types of calls accepted by the reducer:

* `set` actions set a single value. An example action for this to pass to the dispatcher would be `{ type: 'set', key: 'something', value: 'new_value'}`;
* `update` actions set multiple values by merging a new dictionary with the old state one. An example action would be `{ type: 'update', data: {something: 'new_value', something_else: 'another_new_value'}}`;
* `call` actions call a function with the state as first argument, and other optional arguments after it, and then update the state with the data returned by the function. This type of action is reserved for complex operations in which for example an action might change parts of the state the interface originally making the dispatch does not have access to. An example action would be: `{ type: 'call', arguments: ['x', 'y'], function: do_something}`

**Store Interfaces**  
Found in: `src/core/store/interfaces/`  
Naming convention: <Name>Interface, use<Name>Interface

Interfaces are JavaScript classes (not React components) that simply provide a single place to hold methods, getters and setters that can be used to manipulate the Redux state. They are meant to simply provide a smoother experience - they should do nothing that can't be done already with the state and dispatcher returned by Redux's `useSelector` and `useDispatch` hooks.

Their rules are:

* the classes should all inherit from `BaseInterface`, found in `src/core/store/utils.js`;
* the base class constructor should not be overridden. The only state it should hold are the `state` and `dispatcher` objects passed to it on creation;
* use of setters and getters is encouraged whenever it makes sense;
* each interface file should also define and export an `initial<Name>State` object that will be used together with others to initialise the overall state;
* each interface should provide its own `use<Name>Interface` hook whose purpose is to use the Redux `useSelector` and `useDispatch` hooks to recover the relevant bits of state and a dispatcher, use them to instantiate the corresponding class, and return it;
* the method `makeSelector` from `src/core/store/utils.js` should be used to create a selector that returns all state variables with a given prefix, plus any extras if necessary;
* because the selector created by `makeSelector` returns an object rather than a single state value, `shallowEqual` should be used as the `equalityFn` argument of `useSelector` to make sure no re-renders are forced without need (see [the Redux documentation](https://react-redux.js.org/api/hooks#equality-comparisons-and-updates) ).

#### Changing selections and displayed atoms, and the Listeners system

A special kind of very common problem happens when we deal with visualizations (such as ellipsoids) that ought to refresh whenever either the selected or displayed atoms change. This problem is dealt with by the Listeners system. This system can be found into `src/core/store/listeners`, and the general idea of it is that it works by running certain functions with special side effects when the following conditions are met:

* the state of the Store has updated;
* the corresponding event has fired (namely, it can be found in the special `listen_update` member of the state).

Events can be found in an enumerator object in `src/core/store/listeners/events.js`. Other listener functions are defined in other files in the same folder, and then associated with events in `src/core/store/listeners/index.js`, where the master Listener method is defined. Listeners must have the following interface:


```
function someListener(state) {

    // Do something with side effects
    
    return [
        {
            data_to_update: 'something'
        },
        ['new_events_to_fire']
    ];

}

``` 

Care must be used because listeners could trigger an infinite loop - there is no guard against that. The appropriate events also must be manually queued for now by any dispatch that wishes to trigger an event (for example, look at the events defining the change of selected and displayed atoms in `SelInterface`). This might be improved in the future, but has currently been deemed the most efficient way of handling it, rather than introducing additional checks at every event. After a first round of events has fired, all the events they triggered will fire, and so on until the event queue is empty.