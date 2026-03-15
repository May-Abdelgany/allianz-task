Interactive Box Selector — RxJS Implementation
Overview

This project implements the Interactive Box Selector Application using Angular and RxJS Observables for reactive state management.

The application presents 10 selectable boxes, where each box can be assigned an option from a shared option list. The state of the selections is persisted in localStorage, allowing the configuration to survive browser refresh.

This implementation focuses on declarative RxJS patterns and service-based state management.

Tech Stack

Angular (Latest Version)

RxJS

Standalone Components

OnPush Change Detection

Zoneless Change Detection

LocalStorage Persistence

Application Features

The application satisfies all required functional criteria:

Displays 10 selectable boxes

Clicking a box opens the option selector panel

Selecting an option assigns it to the box

Automatically activates the next box

Clicking a selected box reopens the selector with the current option preselected

Remove All Selections clears all assignments

Selections persist across browser refresh

State hydrates from localStorage on application start

Architecture

The project follows a feature-based architecture with clear separation between:

UI components

domain services

state management

persistence

src/app
│
├── core
│   └── services
│       ├── localStorage
│       │   └── local-storage.service.ts
│       │
│       └── storage
│           └── storage.service.ts
│
├── features
│   └── box-selector
│       │
│       ├── components
│       │   ├── box
│       │   ├── box-grid
│       │   ├── option-selector
│       │   └── total
│       │
│       ├── models
│       │
│       └── services
│           ├── box
│           │   └── box.service.ts
│           │
│           └── saltos
│               └── saltos.service.ts
State Management (RxJS)

All application state is managed using RxJS Observables.

State is centralized in:

storage.service.ts

This service contains:

BehaviorSubjects for state

derived Observables

event streams for user actions

Declarative Reactive Pattern

User interactions are converted into streams of events.

Examples include:

box click events

option selection events

remove-all events

These streams are processed using RxJS operators such as:

map

scan

combineLatest

tap

This ensures a declarative and predictable state flow.

Services Layer

Services encapsulate domain logic and coordinate with the storage service.

BoxService

Handles:

box interaction logic

triggering box selection

delegating updates to the storage service

SaltosService

Responsible for:

loading available options

providing option data to components

The options are loaded from:

saltos.json
StorageService

Acts as the central reactive state manager.

Responsibilities include:

storing box selections

tracking the active box

exposing reactive state streams

triggering persistence

LocalStorageService

Located in:

core/services/localStorage

Responsible for:

saving state to browser storage

retrieving stored state

isolating persistence logic

Components

The UI is composed of focused standalone components.

BoxGridComponent

Displays the grid of 10 boxes.

BoxComponent

Represents a single box.

Responsibilities:

display assigned option

emit selection events

OptionSelectorComponent

Displays the list of available options when a box is selected.

TotalComponent

Displays derived information based on selections.

Angular Best Practices

This project follows modern Angular recommendations:

Standalone components

OnPush change detection

Zoneless Angular

New template control flow

Examples:

@if
@for
@switch
Persistence

Selections are stored using localStorage.

Whenever the state changes:

localStorage.setItem()

When the application initializes:

stored state is retrieved

storage service hydrates the application state

UI renders previous selections

Design Philosophy

The architecture ensures:

Components

UI-focused

minimal logic

reactive subscriptions only

Services

encapsulate domain logic

StorageService

single source of truth

reactive state flow

Running the Project

Install dependencies:

npm install

Run the application:

ng serve

Open in browser:

local : http://localhost:4200
production : https://allianz-task-git-master-may-awaads-projects-7ca2c48a.vercel.app/
Notes

The project prioritizes:

clean architecture

reactive programming

code readability

Visual styling is intentionally minimal, as the focus of the assessment is state management and architectural quality rather than UI design.
