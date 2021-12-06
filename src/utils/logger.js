const childProcess = require('child_process');
const stream = require('stream');
const pinoms = require('pino-multi-stream');

// Environment variables
const cwd = process.cwd();
const { env } = process;
const logPath = `${cwd}/log`;

// Create a stream where the logs will be written
const logThrough = new stream.PassThrough();
const prettyStream = pinoms.prettyStream({
  prettyPrint:
    {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'hostname,pid', // add 'time' to remove timestamp
    },
});
const streams = [
  { stream: logThrough },
  { stream: prettyStream },
];

const logger = pinoms(pinoms.multistream(streams));

const child = childProcess.spawn(process.execPath, [
  require.resolve('pino-tee'),
  'error', `${logPath}/error.log`,
  'fatal', `${logPath}/fatal.log`,
], { cwd, env });

logThrough.pipe(child.stdin);

module.exports = logger;
