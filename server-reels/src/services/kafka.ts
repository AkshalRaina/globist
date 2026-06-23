import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'reels-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: 'media-processor-group' });

export const connectKafka = async () => {
  try {
    await producer.connect();
    console.log('✅ Kafka Producer connected');
    
    await consumer.connect();
    console.log('✅ Kafka Consumer connected');
  } catch (error) {
    console.error('❌ Kafka connection error', error);
  }
};
