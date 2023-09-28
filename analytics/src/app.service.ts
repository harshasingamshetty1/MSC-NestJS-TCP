import { Injectable } from '@nestjs/common';
import { CreateUserEvent } from './create-user-event';

@Injectable()
export class AppService {
  private readonly analytics = [];
  getHello(): string {
    return 'Hello World!';
  }

  handleUserCreated(data: CreateUserEvent) {
    this.analytics.push({
      email: data.email,
      timestamp: new Date(),
    });
    console.log('handleUserCreated -- ANALYTICS MSC', this.analytics);
  }

  getAnalytics() {
    return this.analytics;
  }
}
