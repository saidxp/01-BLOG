import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { GetAdminUsersUseCase } from '../../../../application/admin/use-cases/users/get-admin-users.use-case';
import { ToggleUserBanUseCase } from '../../../../application/admin/use-cases/users/toggle-user-ban.use-case';
import { DeleteUserUseCase } from '../../../../application/admin/use-cases/users/delete-user.use-case';
import { AdminUser } from '../../../../domain/admin/entity/admin-user.entity';
import { Role } from '../../../../enum/Role';
import { UserStatus } from '../../../../enum/UserStatus';
import { AdminUsersComponent } from './admin-users.component';

describe('AdminUsersComponent', () => {
  let fixture: ComponentFixture<AdminUsersComponent>;
  let component: AdminUsersComponent;
  let toggleBan: jasmine.SpyObj<ToggleUserBanUseCase>;
  let deleteUser: jasmine.SpyObj<DeleteUserUseCase>;

  const user = new AdminUser(7, 'member', 'member@example.com', Role.USER, UserStatus.ACTIVE, new Date());

  beforeEach(async () => {
    const getUsers = jasmine.createSpyObj<GetAdminUsersUseCase>('GetAdminUsersUseCase', ['execute']);
    toggleBan = jasmine.createSpyObj<ToggleUserBanUseCase>('ToggleUserBanUseCase', ['execute']);
    deleteUser = jasmine.createSpyObj<DeleteUserUseCase>('DeleteUserUseCase', ['execute']);
    getUsers.execute.and.returnValue(of({ users: [user], currentPage: 0, totalPages: 1 }));

    await TestBed.configureTestingModule({
      imports: [AdminUsersComponent],
      providers: [
        { provide: GetAdminUsersUseCase, useValue: getUsers },
        { provide: ToggleUserBanUseCase, useValue: toggleBan },
        { provide: DeleteUserUseCase, useValue: deleteUser },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('does not mutate a user when confirmation is cancelled', () => {
    component.requestDeleteUser(user);
    component.cancelPendingAction();

    expect(deleteUser.execute).not.toHaveBeenCalled();
    expect(component.pendingAction()).toBeNull();
  });

  it('deletes a user only after confirmation', () => {
    deleteUser.execute.and.returnValue(of(void 0));

    component.requestDeleteUser(user);
    component.confirmPendingAction();

    expect(deleteUser.execute).toHaveBeenCalledOnceWith(user.id);
    expect(component.users()).toEqual([]);
  });

  it('toggles a ban only after confirmation', () => {
    const bannedUser = new AdminUser(user.id, user.username, user.email, user.role, UserStatus.BANNED, user.createdAt);
    toggleBan.execute.and.returnValue(of(bannedUser));

    component.requestToggleBan(user);
    component.confirmPendingAction();

    expect(toggleBan.execute).toHaveBeenCalledOnceWith(user.id, false);
    expect(component.users()[0].status).toBe(UserStatus.BANNED);
  });
});
