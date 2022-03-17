class Camera {
  createCamera (player: PlayerMp, pos1: Vector3Mp, pos2: Vector3Mp, viewangle: number): void {
    player.call('cCamera-CreateCamera', [pos1, pos2, viewangle])
  }

  resetCamera (player: PlayerMp): void {
    player.call('cCamera-ResetCamera')
  }
}
export default new Camera()
