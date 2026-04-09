#include <SDL2/SDL.h>

#include <stdint.h>
#include <stdio.h>

#define SCR_SIZE 500
#define TILE_SIZE 32

int main() {
  int width, height;
  printf("Enter width: ");
  scanf("%d", &width);
  printf("Enter height: ");
  scanf("%d", &height);

  uint8_t tiles[width * height];
  for (int i = 0; i < width*height; ++i) {
    tiles[i] = 0;
  }

  if (SDL_Init(SDL_INIT_VIDEO) < 0) {
    printf("Failed to init SDL.");
    return 1;
  }

  SDL_Window *window =
      SDL_CreateWindow("World Creator", SDL_WINDOWPOS_CENTERED,
                       SDL_WINDOWPOS_CENTERED, SCR_SIZE, SCR_SIZE, 0);
  if (!window) {
    printf("Failed to create window.");
    SDL_Quit();
    return 1;
  }

  SDL_Renderer *renderer = SDL_CreateRenderer(window, -1, 0);
  if (!renderer) {
    printf("Failed to create renderer.");
    SDL_DestroyWindow(window);
    return 1;
  }

  SDL_Event event;
  int running = 1;
  while (running) {
    while(SDL_PollEvent(&event)) {
      if (event.type == SDL_QUIT) {
        running = 0;
      } else if (event.type == SDL_MOUSEBUTTONDOWN) {
        int x = event.button.x / TILE_SIZE;
        int y = event.button.y / TILE_SIZE;
        if (x >= 0 && y >= 0 && x < width && y < height) {
          int index = y * width + x;
          tiles[index] = tiles[index] == 0 ? 1 : 0;
        }
      }
    }

    SDL_SetRenderDrawColor(renderer, 0, 0, 0, 255);
    SDL_RenderClear(renderer);

    for (int x = 0; x < width; ++x) {
      for (int y = 0; y < height; ++y) {
        if (tiles[y * width + x] == 0) {
          SDL_SetRenderDrawColor(renderer, 10, 10, 10, 255);
        } else {
          SDL_SetRenderDrawColor(renderer, 200, 100, 100, 255);
        }
        SDL_Rect shape = {x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE};
        SDL_RenderFillRect(renderer, &shape);
      }
    }

    SDL_RenderPresent(renderer);
  }

  FILE* f = fopen("worlds/1.wld", "wb");
  if (!f) {
    perror("Failed to create file.");
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 1;
  }

  fwrite(&width, sizeof(int), 1, f);
  fwrite(&height, sizeof(int), 1, f);

  fwrite(tiles, sizeof(uint8_t), width*height, f);

  fclose(f);

  SDL_DestroyRenderer(renderer);
  SDL_DestroyWindow(window);
  SDL_Quit();

  return 0;
}
