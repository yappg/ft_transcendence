# Transcendence - Pong Website Project

A modern web implementation of the classic Pong game with multiplayer capabilities and tournament features.

## Overview

This project creates a web-based Pong game platform where users can:

- Play Pong against other players in real-time
- Participate in tournaments
- Track matches and scores
- Interact with other players

## Technical Requirements

### Core Requirements

- Single-page application
- Compatible with latest stable Google Chrome version
- Docker containerization
- HTTPS enabled
- Form validation and security measures

### Base Game Features

- Live Pong gameplay
- Tournament system
- Player registration
- Matchmaking system
- Fair gameplay mechanics
- Classic Pong (1972) inspired design

### Security Features

- Password hashing
- Protection against SQL injections/XSS
- HTTPS/WSS connections
- Input validation
- Secure credential management via .env files

## Optional Modules

### Web

- Backend Framework
- Frontend Framework/Toolkit
- Database Integration

### User Management

- Standard User Management
- Remote Authentication

### Gameplay

- Remote Players
- Live Chat

### Analytics

- Stats Dashboard

### Security

- 2FA & JWT

### DevOps

- Monitoring System

## Getting Started

1. Clone the repository
2. Create and configure your `.env` from the provided `template.env` file
3. Run the application:

   ```bash
   git clone git@github.com:yappg/ft_transcendence.git
   cd ft_transcendence
   mv template.env .env
   make

## Development Guidelines

- Credentials must be stored in `.env` (not in git)
- Follow single-page application principles
- Ensure browser back/forward compatibility
- Maintain clean error handling
