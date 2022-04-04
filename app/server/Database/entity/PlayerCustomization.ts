import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class PlayerCustomization {
  @PrimaryGeneratedColumn()
  id: number

  @Column('int')
  player_id: number

  @Column('smallint')
  gender: number

  @Column('smallint')
  parents_father: number

  @Column('smallint')
  parents_mother: number

  @Column('float')
  parents_similarity: number

  @Column('float')
  parents_skin_similarity: number

  @Column('float')
  features_01: number

  @Column('float')
  features_02: number

  @Column('float')
  features_03: number

  @Column('float')
  features_04: number

  @Column('float')
  features_05: number

  @Column('float')
  features_06: number

  @Column('float')
  features_07: number

  @Column('float')
  features_08: number

  @Column('float')
  features_09: number

  @Column('float')
  features_10: number

  @Column('float')
  features_11: number

  @Column('float')
  features_12: number

  @Column('float')
  features_13: number

  @Column('float')
  features_14: number

  @Column('float')
  features_15: number

  @Column('float')
  features_16: number

  @Column('float')
  features_17: number

  @Column('float')
  features_18: number

  @Column('float')
  features_19: number

  @Column('float')
  features_20: number

  @Column('smallint')
  appearance_01_value: number

  @Column('float')
  appearance_01_opacity: number

  @Column('smallint')
  appearance_02_value: number

  @Column('float')
  appearance_02_opacity: number

  @Column('smallint')
  appearance_03_value: number

  @Column('float')
  appearance_03_opacity: number

  @Column('smallint')
  appearance_04_value: number

  @Column('float')
  appearance_04_opacity: number

  @Column('smallint')
  appearance_05_value: number

  @Column('float')
  appearance_05_opacity: number

  @Column('smallint')
  appearance_06_value: number

  @Column('float')
  appearance_06_opacity: number

  @Column('smallint')
  appearance_07_value: number

  @Column('float')
  appearance_07_opacity: number

  @Column('smallint')
  appearance_08_value: number

  @Column('float')
  appearance_08_opacity: number

  @Column('smallint')
  appearance_09_value: number

  @Column('float')
  appearance_09_opacity: number

  @Column('smallint')
  appearance_10_value: number

  @Column('float')
  appearance_10_opacity: number

  @Column('smallint')
  appearance_11_value: number

  @Column('float')
  appearance_11_opacity: number

  @Column('smallint')
  hair_value: number

  @Column('smallint')
  hair_color: number

  @Column('smallint')
  hair_highlight_color: number

  @Column('smallint')
  eyebrow_color: number

  @Column('smallint')
  beard_color: number

  @Column('smallint')
  eye_color: number

  @Column('smallint')
  blush_color: number

  @Column('smallint')
  lipstick_color: number

  @Column('smallint')
  chest_hair_color: number
}
