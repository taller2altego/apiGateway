const Kafka = require('node-rdkafka');
// const logger = require('../../winston');

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



module.exports = eventToLog => {
  console.log('entro al producer');

  const topic = 'oqgbz3ul-metrics';
  const producer = new Kafka.Producer(kafkaConf);

  producer.on('ready', () => {
    /* eslint-disable */
    const message = new Buffer.from(eventToLog);
    producer.produce(topic, -1, message, 1);
    setTimeout(() => producer.disconnect(), 0);
  });

  producer.on('disconnected', () => {
    // logger.info('Se desconectó el cliente');
    console.log('se desconectó el cliente');
  });

  producer.on('event.error', err => {
    // logger.(err);
    console.log('event.error');
    console.log(err);
  });

  producer.on('event.log', log => {
    // logger.log(log);
    console.log('event.log');
    console.log(log)
  });

  producer.connect();
};