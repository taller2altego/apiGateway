const Kafka = require('node-rdkafka');
const logger = require('../../winston');

const kafkaConf = {
  'group.id': 'cloudkarafka-example',
  'metadata.broker.list': [
    'dory-01.srvs.cloudkafka.com:9094',
    'dory-02.srvs.cloudkafka.com:9094',
    'dory-03.srvs.cloudkafka.com:9094'
  ],
  'socket.keepalive.enable': true,
  'security.protocol': 'SASL_SSL',
  'sasl.mechanisms': 'SCRAM-SHA-256',
  'sasl.username': 'oqgbz3ul',
  'sasl.password': 'iaF7T41JyBkHHiR-Y4pMp9s9u_bhCbvb',
  debug: 'generic,broker,security'
};

const topic = 'oqgbz3ul-metrics';
const producer = new Kafka.Producer(kafkaConf);

module.exports = eventToLog => {
  producer.on('ready', () => {
    /* eslint-disable */
    const message = new Buffer.from(eventToLog);
    producer.produce(topic, -1, message);
  });

  producer.on('disconnected', () => {
    logger.info('Se desconectó el cliente');
  });

  producer.on('event.error', err => {
    logger.error(err);
  });

  producer.on('event.log', log => {
    logger.log(log);
  });

  producer.connect();
};
