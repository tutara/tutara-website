# Design Philosophy

Tutara is designed based on a set of requirements and ideas made by the
developers of the language. This document is a list of these in non descriptive
order.

- **The language puts the developer in a position to write a scripts in a quick
  manner by supporting an easy and fast to write syntax.**
  
  A lot of keywords in the syntax are based on shorthands. A variable is either
  declared by writing `val` or `var`. This in combination with
  [type inference](https://en.wikipedia.org/wiki/Type_inference) brings a fast
  way  of working with data in scripts. The language itself is statically typed
  to prevent bugs before execution of the code. When defining a lot of variables
  without a type it might become unclear wich type of data is stored there.
  By using static typing the interpreter knows the actual type of a variable and
  can provide information on what properties or methods are available on the
  type using autocomplete in the IDE.
  
  By providing a variety of syntactic sugar options. Developers can simplify
  their scripts a lot. Options like writing `foo += 1` instead of
  `foo = foo + 1` is an easy example of this. But this can become more complex
  like large if statements that can be rewritten using a match or a `loop {}`
  that is easier to read then `while(true) {}`. By allowing multiple ways of
  writing the same behavior a developer can create easier to read code which
  helps with the maintainability of a project.

- **Developers should be able to learn the language with ease.**

  The language can be classified as a C-like language as the basic syntax looks
  a lot like the C programming language. A lot of the popular languages in use
  today are similar in their syntax. From a general-purpose language like
  Python to an enterprise language like Java or C#. They all share a common set
  of syntactic features like looping, condition and expressions. Tutara follows
  this set with some small differences to make it easy to understand the
  language for developers.

- **Installing Tutara should be fast and straight forward.**

  The goal is for developers to install and configure Tutara with ease. We do
  not want complex installing processes where the developer has to set a
  variety of environment variables, download dependencies or change anything in
  the OS.
  
  It should be a plug and play style of system. You get the Tutara CLI and you
  can immediately write a script and execute it.

- **The goal of Tutara scripts is to automate small tasks**

  When using Tutara there should be a focus on automating simple tasks. All
  users have some form of task they execute by hand that can be automated. It
  might be hashing a certain value or renaming files and folders in the
  filesystem. Developers should be able to use Tutara script for solving these
  'time wasters'.

- **Scripts are written for a specific context in their respective
  environments.**

  When automating tasks you usually work with input data, perform some
  operations and get different data back. The principle here is that it works
  within a specified _context_. This can for example be an HTTP-context where
  the script has access to the HTTP request and response. The developer writes
  the script based on these parameters. Its important that contexts are
  versitile and can be expanded upon to use Tutara as an automation platform.

- **Scripts run in a sanbox within their environments and may have restricted
  capabilities.**

  Tutara is an interpreted language. Meaning it executes while reading scripts.
  It means that you only have to write the desired script which is passed to
  the CLI and it works. No additional configuration or handling of binaries is
  needed.
  
  On a surface level this may imply a drawback for the system. Scripts are text
  files that have to be converted into machine code when it is called. The
  platform can cache the machine code for faster execution by sending compiled
  scripts to the virtual machine.
  
  Scripts run within a specific context that gives acces to what it needs.
  Meaning if a script in the HTTP context needs access to the file system for
  certain reasons it has to specifically get this premission. When it does not
  have this permission it will throw runtime errors. This reduces the footprint
  of the script and adds an abritray layer of 'security' for the scripts.
  Platforms can optionally add configuration files to enable or disable
  permissions.

- **Tutara is Free and Open Source Software (FOSS) first.**

  In the current development ecosystem there are a lot of proprietary tools and
  large companies making software that is closed to the outside of the world. We
  believe that this is the correct way for our language. There are thousands of
  Open Source projects out there that are used every day by small developers and
  huge companies. We as a community should endorse these developers as their
  contributions to our field are extremely important for its survival.
  
  Therefor we made the inevitable decision to develop Tutara as Free and
  Open Source Software with a matching license.

- **Tutara is experimental until we consider it stable.**
  
  The project started out as a challenge to understand low level programming.
  Choices that were made in the past should be reconsidered when in doubt.
  Syntax may drastically change if deemed insufficient for the design
  philosophy.
  
  We're always open to honest feedback and appreciate all the help from
  third-parties. Even for bad decisions, we are also humans and we can make
  mistakes. We are always open for learning new concepts to improve our craft.
