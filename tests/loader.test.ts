import { describe, it, expect } from 'vitest';
import {
  ParticleLoader,
  Particle_Loader,
  DEFAULT_PARTICLE_LOADER_OPTIONS,
} from '../src/Loader';

describe('ParticleLoader Component & Options', () => {
  it('should export ParticleLoader and alias Particle_Loader', () => {
    expect(ParticleLoader).toBeDefined();
    expect(Particle_Loader).toBe(ParticleLoader);
  });

  it('should provide sensible default options', () => {
    expect(DEFAULT_PARTICLE_LOADER_OPTIONS.color).toBe('#484747');
    expect(DEFAULT_PARTICLE_LOADER_OPTIONS.backgroundColor).toBe('transparent');
    expect(DEFAULT_PARTICLE_LOADER_OPTIONS.boxSize).toBe(65.0);
    expect(DEFAULT_PARTICLE_LOADER_OPTIONS.duration).toBe(2.2);
    expect(DEFAULT_PARTICLE_LOADER_OPTIONS.delay).toBe(0.6);
    expect(DEFAULT_PARTICLE_LOADER_OPTIONS.ease).toBe('power2.inOut');
    expect(DEFAULT_PARTICLE_LOADER_OPTIONS.fadeDuration).toBe(0.28);
    expect(DEFAULT_PARTICLE_LOADER_OPTIONS.autoPlay).toBe(true);
    expect(DEFAULT_PARTICLE_LOADER_OPTIONS.reverse).toBe(false);
    expect(DEFAULT_PARTICLE_LOADER_OPTIONS.zIndex).toBe(50);
  });
});
