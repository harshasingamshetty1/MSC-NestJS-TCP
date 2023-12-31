import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserEvent } from './create-user-event';
import { CreateUserDto } from './dto/create-user-request.dto';

@Injectable()
export class AppService {
  private readonly users: any[] = [];

  //The inject token is defined as the name field of the MSC in the app.module
  constructor(
    @Inject('COMMUNICATION') private readonly communicationClient: ClientProxy,
    @Inject('ANALYTICS') private readonly analyticsClient: ClientProxy,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  createUser(createUserDto: CreateUserDto) {
    this.users.push(createUserDto);

    //Event pattern communication
    this.communicationClient.emit(
      'user_created',
      new CreateUserEvent(createUserDto.email),
    );
    this.analyticsClient.emit(
      'user_created',
      new CreateUserEvent(createUserDto.email),
    );
  }

  getAnalytics() {
    //Message pattern communication
    //send returns a "cold" obsseravable, so only when subscribed to this call
    //the message will be sent.
    //luckily when an observer is returned from a controller, NestJs automatically subscribes it for us
    this.analyticsClient.send({ cmd: 'get_analytics' }, {});
  }
}
