/*
auto-generated by: https://github.com/pmndrs/gltfjsx
*/
import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from 'react-three-fiber'
import { useGLTF } from '@react-three/drei/useGLTF'

import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import {AnimationAction, AnimationMixer, Bone, Group, LoopOnce, MeshToonMaterial, SkinnedMesh} from "three";
import {hexStringToCode} from "../../../utils/color";
import {Event} from "three/src/core/EventDispatcher";

type GLTFResult = GLTF & {
  nodes: {
    Cube004: SkinnedMesh
    ['Cube.004_1']: SkinnedMesh
    ['Cube.004_2']: SkinnedMesh
    ['Cube.004_3']: SkinnedMesh
    ['Cube.004_4']: SkinnedMesh
    Bone: Bone
  }
  materials: {
    Armor: THREE.MeshStandardMaterial
    Armor_Dark: THREE.MeshStandardMaterial
    Skin: THREE.MeshStandardMaterial
    Detail: THREE.MeshStandardMaterial
    Red: THREE.MeshStandardMaterial
  }
}

const redMaterial = new MeshToonMaterial({
    color: hexStringToCode("#45555a"),
    skinning: true,
});
redMaterial.color.convertSRGBToLinear();

const detailMaterial = new MeshToonMaterial({
    color: hexStringToCode("#ffffff"),
    skinning: true,
});
detailMaterial.color.convertSRGBToLinear();

const skinMaterial = new MeshToonMaterial({
    color: hexStringToCode("#131313"),
    skinning: true,
});
skinMaterial.color.convertSRGBToLinear();

const armorMaterial = new MeshToonMaterial({
    color: hexStringToCode("#393939"),
    skinning: true,
});
armorMaterial.color.convertSRGBToLinear();

const armorDarkMaterial = new MeshToonMaterial({
    color: hexStringToCode("#242424"),
    skinning: true,
});
armorDarkMaterial.color.convertSRGBToLinear();

type ActionName = 'Idle' | 'PickUp' | 'Punch' | 'RecieveHit' | 'Run' | 'SitDown' | 'Walk'
type GLTFActions = Record<ActionName, AnimationAction>

export default function Knight({moving, running, lastAttack, ...props}: JSX.IntrinsicElements['group'] & {
    moving: boolean,
    running: boolean,
    lastAttack: number,
}) {
  const group = useRef<Group>()
  const { nodes, materials, animations } = useGLTF('/Knight_Golden_Male.glb') as GLTFResult

  const actions = useRef<GLTFActions>()
  const [mixer] = useState(() => new AnimationMixer(nodes['Cube.004_4']))

    const currentAnimationRef = useRef<{
        key: string | null,
        animation: any,
        finished: boolean,
    }>({
        key: null,
        animation: null,
        finished: false,
    })

  useFrame((state, delta) => mixer.update(delta))
  useEffect(() => {
    actions.current = {
      Idle: mixer.clipAction(animations[0], group.current),
      PickUp: mixer.clipAction(animations[1], group.current),
      Punch: mixer.clipAction(animations[2], group.current),
      RecieveHit: mixer.clipAction(animations[3], group.current),
      Run: mixer.clipAction(animations[4], group.current),
      SitDown: mixer.clipAction(animations[5], group.current),
      Walk: mixer.clipAction(animations[6], group.current),
    }
    actions.current.Punch.loop = LoopOnce
    actions.current.Punch.clampWhenFinished = true
    actions.current.Punch.timeScale = 1.2
    return () => animations.forEach((clip) => mixer.uncacheClip(clip))
  }, [])


    useEffect(() => {

        let unsubscribe = () => {}

        const calculateAnimation = () => {

            if (!actions.current) return

            const currentAnimation = currentAnimationRef.current

            const duration = 0.2
            const quickDuration = 0.05

            const playAnimation = (animation: any, fadeInDuration: number, fadeDuration: number, key: string | null) => {
                if (currentAnimation.animation) {
                    currentAnimation.animation.fadeOut(fadeDuration)
                } else {
                    fadeInDuration = 0
                }
                animation
                    .reset()
                    .setEffectiveWeight(1)
                    .fadeIn(fadeInDuration)
                    .play();
                currentAnimation.animation = animation
                currentAnimation.key = key
                currentAnimation.finished = false
            }

            const isHit = lastAttack > Date.now() - 100
            const key = lastAttack.toString()

            if (isHit || (currentAnimation.key === key && !currentAnimation.finished)) {

                if (currentAnimation.animation && currentAnimation.key === key) {
                    //
                } else {
                    playAnimation(actions.current.Punch, quickDuration, quickDuration, key)
                }

                const onFinished = (event: Event) => {
                    mixer.removeEventListener('finished', onFinished)
                    if (actions.current && event.action === actions.current.Punch) {
                        currentAnimation.finished = true
                        calculateAnimation()
                    }
                }

                mixer.addEventListener('finished', onFinished)

                unsubscribe = () => {
                    mixer.removeEventListener('finished', onFinished)
                }

            } else {

                if (moving) {

                    if (running) {
                        playAnimation(actions.current.Run, duration, duration, null)
                    } else {
                        playAnimation(actions.current.Walk, duration, duration, null)
                    }

                } else {
                    playAnimation(actions.current.Idle, duration, duration, null)
                }

            }

        }

        calculateAnimation()

        return () => {
            unsubscribe()
        }

    }, [moving, running, lastAttack])

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={nodes.Bone} />
      <skinnedMesh receiveShadow castShadow material={armorMaterial} geometry={nodes.Cube004.geometry} skeleton={nodes.Cube004.skeleton} />
      <skinnedMesh receiveShadow castShadow
        material={armorDarkMaterial}
        geometry={nodes['Cube.004_1'].geometry}
        skeleton={nodes['Cube.004_1'].skeleton}
      />
      <skinnedMesh receiveShadow castShadow
        material={armorDarkMaterial}
        geometry={nodes['Cube.004_2'].geometry}
        skeleton={nodes['Cube.004_2'].skeleton}
      />
      <skinnedMesh receiveShadow castShadow
        material={armorMaterial}
        geometry={nodes['Cube.004_3'].geometry}
        skeleton={nodes['Cube.004_3'].skeleton}
      />
      <skinnedMesh receiveShadow castShadow
        material={armorMaterial}
        geometry={nodes['Cube.004_4'].geometry}
        skeleton={nodes['Cube.004_4'].skeleton}
      />
    </group>
  )
}

useGLTF.preload('/Knight_Golden_Male.glb')
