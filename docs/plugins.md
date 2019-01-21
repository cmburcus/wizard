# Plugin guide for wizard

Plugins allow you to add features to wizard, such as commands and
extensions to the `context` object that provides the majority of the functionality
used by wizard.

Creating a wizard plugin is easy. Just create a repo with two folders:

```
commands/
extensions/
```

A command is a file that looks something like this:

```js
// commands/foo.js

module.exports = (context) => {
  const { print, filesystem } = context

  const desktopDirectories = filesystem.subdirectories(`~/Desktop`)
  print.info(desktopDirectories)
}
```

An extension lets you add additional features to `context`.

```js
// extensions/bar-extension.js

module.exports = (context) => {
  const { print } = context

  context.bar = () => { print.info('Bar!') }
}
```

This is then accessible in your plugin's commands as `context.bar`.

# Loading a plugin

To load a particular plugin (which has to start with `wizard-*`),
install it to your project using `npm install --save-dev wizard-PLUGINNAME`,
and wizard will pick it up automatically.
