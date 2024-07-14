﻿namespace API.Interfaces;

public interface IUnitOfWork
{
    IUserRepository UserRepository { get; }
    IThemeRepository ThemeRepository { get; }
    Task<bool> Complete();

}
