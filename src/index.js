const path = require('path');
const { pushSync, pullSync, writeDefaultConfig } = require('./sync');
function print(s) {
  process.stdout.write(String(s) + '\n');
}
function printErr(s) {
  process.stderr.write(String(s) + '\n');
}
function help() {
  print('html-md-sync <command> [options]');
  print('');
  print('Commands:');
  print('  push                Sync from Markdown to HTML');
  print('  pull                Extract from HTML to Markdown');
  print('  init                Generate a default sync-config.json');
  print('  help                Show this help');
  print('  version             Show the version');
  print('');
  print('Options:');
  print('  --config <path>     Path to the config file (default: sync-config.json)');
}
function getArg(flag) {
  const i = process.argv.indexOf(flag);
  if (i >= 0 && i + 1 < process.argv.length) return process.argv[i + 1];
  return null;
}
async function runCLI() {
  const cmd = (process.argv[2] || '').toLowerCase();
  if (!cmd || cmd === 'help' || cmd === '--help' || cmd === '-h') {
    help();
    return;
  }
  if (cmd === 'version' || cmd === '--version' || cmd === '-v') {
    const pkg = require(path.resolve(__dirname, '..', 'package.json'));
    print(pkg.version || '0.0.0');
    return;
  }
  const configPath = getArg('--config');
  if (cmd === 'init') {
    try {
      const p = writeDefaultConfig(configPath || 'sync-config.json');
      print('Config written to: ' + p);
      return;
    } catch (e) {
      printErr(e.message || String(e));
      process.exitCode = 1;
      return;
    }
  }
  if (cmd === 'push') {
    try {
      await pushSync(configPath || undefined);
      print('Push completed');
    } catch (e) {
      printErr(e.message || String(e));
      process.exitCode = 1;
    }
    return;
  }
  if (cmd === 'pull') {
    try {
      await pullSync(configPath || undefined);
      print('Pull completed');
    } catch (e) {
      printErr(e.message || String(e));
      process.exitCode = 1;
    }
    return;
  }
  help();
  process.exitCode = 1;
}
module.exports = { runCLI };
