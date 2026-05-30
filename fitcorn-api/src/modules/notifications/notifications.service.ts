import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import * as Bull from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectQueue('notifications') private readonly notificationsQueue: Bull.Queue,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Enqueue an email notification job
   */
  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    await this.notificationsQueue.add(
      'email',
      { to, subject, html },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: true,
      },
    );
  }

  /**
   * Enqueue a WhatsApp notification job
   */
  async sendWhatsApp(to: string, message: string): Promise<void> {
    // Clean phone number (remove +, spaces, ensure country code)
    let formattedPhone = to.replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('08')) {
      formattedPhone = '628' + formattedPhone.slice(2);
    }

    await this.notificationsQueue.add(
      'whatsapp',
      { to: formattedPhone, message },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: true,
      },
    );
  }

  /**
   * Create an in-app notification and optionally trigger email/WhatsApp
   */
  async createNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    data?: any,
    sendEmail = false,
    sendWhatsApp = false,
  ): Promise<Notification> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const notification = this.notificationRepository.create({
      user,
      type,
      title,
      message,
      data,
    });

    const savedNotification = await this.notificationRepository.save(notification);

    if (sendEmail && user.email) {
      await this.sendEmail(user.email, title, `<p>${message}</p>`);
    }

    if (sendWhatsApp && user.phone) {
      await this.sendWhatsApp(user.phone, `*${title}*\n\n${message}`);
    }

    return savedNotification;
  }
}
