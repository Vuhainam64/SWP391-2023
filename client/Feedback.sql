-- Tạo cơ sở dữ liệu
USE master
GO

-- Kiểm tra nếu cơ sở dữ liệu tồn tại và xóa nó nếu có
IF EXISTS (SELECT * FROM sysdatabases WHERE name = 'Feedback')
BEGIN
    RAISEERROR('Dropping existing Feedback database ....', 0, 1)
    DROP DATABASE Feedback
END
GO

CHECKPOINT
GO

RAISEERROR('Creating Feedback database....', 0, 1)
GO

CREATE DATABASE Feedback
GO

CHECKPOINT
GO

USE Feedback
GO

-- Tạo bảng dữ liệu cho người dùng
RAISEERROR('Creating Table Users....', 0, 1)
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(50) UNIQUE,
    PasswordHash NVARCHAR(100),
    FirstName NVARCHAR(50),
    LastName NVARCHAR(50),
    Email NVARCHAR(100),
    -- Thêm các trường khác nếu cần
);
GO

-- Tạo bảng dữ liệu cho phản hồi về cơ sở vật chất
RAISEERROR('Creating Table Feedback....', 0, 1)
CREATE TABLE Feedback (
    FeedbackID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT,  -- Khóa ngoại liên kết với bảng Users
    FeedbackText NVARCHAR(MAX),
    FeedbackImage VARBINARY(MAX),
    FeedbackLocation NVARCHAR(255),
    SubmissionDate DATETIME,
    Status INT  -- Trạng thái phản hồi, có thể là 1 (Chưa xử lý), 2 (Đang xử lý), 3 (Đã xử lý)
);
GO

-- Tạo bảng dữ liệu cho quản lý phản hồi
RAISEERROR('Creating Table FeedbackProcessing....', 0, 1)
CREATE TABLE FeedbackProcessing (
    ProcessingID INT PRIMARY KEY IDENTITY(1,1),
    FeedbackID INT,  -- Khóa ngoại liên kết với bảng Feedback
    EmployeeID INT,  -- Khóa ngoại liên kết với bảng Employee
    ProcessDate DATETIME,
    Status INT  -- Trạng thái xử lý, có thể là 1 (Chưa xử lý), 2 (Đang xử lý), 3 (Đã xử lý)
);
GO

-- Tạo bảng dữ liệu cho thông báo
RAISEERROR('Creating Table Notification....', 0, 1)
CREATE TABLE Notification (
    NotificationID INT PRIMARY KEY IDENTITY(1,1),
    FeedbackID INT,  -- Khóa ngoại liên kết với bảng Feedback
    ProcessID INT,  -- Khóa ngoại liên kết với bảng FeedbackProcessing
    NotificationDate DATETIME
);
GO
