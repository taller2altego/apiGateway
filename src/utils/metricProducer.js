const logger = require('../../winston');

module.exports = eventToLog => {
  if (process.env.NODE_ENV === 'local') {
    return;
  }

  const Kafka = require('node-rdkafka');

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

  producer.on('ready', () => {
    const message = new Buffer.from(eventToLog);
    producer.produce(topic, -1, message, 1);
    setTimeout(() => producer.disconnect(), 0);
  });

  producer.on('disconnected', () => {
    logger.info('se desconectó el cliente');
  });

  producer.on('event.error', err => {
    logger.error('event.error');
    logger.error(err);
  });

  producer.on('event.log', log => {
    logger.info('event.log');
    logger.info(log);
  });

  producer.connect();
};
