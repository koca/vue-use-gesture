---
title: Motivation
section: About
---

# Why use Vue UseGesture

&zwnj;<vue-use-gesture></vue-use-gesture> is a library that focuses on making complex gestures such as drag and pinch easy to configure.

In most situations, `onDrag` becomes as easy to set up as `onMouseMove`. However, you remain in control of the full gesture logic, which allows you to make your components behave exactly the way you want.

## Augmenting events

A secondary aspect of <vue-use-gesture></vue-use-gesture> is to upgrade gestures with additional kinematics attributes, such as **velocity**, **distance**, **delta** and more, that don't come with native browser events.

&zwnj;<vue-use-gesture></vue-use-gesture> also debounces `scroll`, `wheel` and `move` events, which gives you the capacity to [trigger logic
when the gesture starts or ends out of the box](/docs/hooks/#start-and-end-handlers).

## Going further

Alexandra Holachek ([site](https://alex.holachek.com/), [twitter](https://twitter.com/alex_holachek)) gave a great talk at React Conf about Progressive Web Animations, where she explains the principles of her approach on creating native-like UI. Her demos use React-spring and React UseGesture Alex's talk strongly influenced some of the features in React UseGesture.

> you can apply same techniques to <vue-use-gesture></vue-use-gesture>

<div>
  <iframe width="704" height="396" src="https://www.youtube.com/embed/laPsceJ4tTY" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## Where to get help

You can either [report an issue](https://github.com/koca/vue-use-gesture/issues) or ping me on [twitter](https://twitter.com/imesutkoca).
