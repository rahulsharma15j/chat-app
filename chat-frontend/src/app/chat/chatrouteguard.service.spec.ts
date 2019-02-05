import { TestBed } from '@angular/core/testing';

import { ChatrouteguardService } from './chatrouteguard.service';

describe('ChatrouteguardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChatrouteguardService = TestBed.get(ChatrouteguardService);
    expect(service).toBeTruthy();
  });
});
