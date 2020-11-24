/*
auto-generated by: https://github.com/pmndrs/gltfjsx
*/
import React, {useRef, useState, useEffect} from 'react'
import {useFrame} from 'react-three-fiber'
import {useGLTF} from '@react-three/drei/useGLTF'
import {GLTF} from 'three/examples/jsm/loaders/GLTFLoader'
import {
    AnimationAction,
    AnimationMixer,
    Bone,
    LoopOnce,
    MeshStandardMaterial,
    MeshToonMaterial,
    SkinnedMesh
} from "three";
import {hexStringToCode} from "../../../utils/color";
import {SkeletonUtils} from "three/examples/jsm/utils/SkeletonUtils";
import {setMaterials, setShadows} from "../../../utils/models";

type GLTFResult = GLTF & {
    nodes: {
        Demon001: SkinnedMesh
        Body: Bone
        Head: Bone
    }
    materials: {
        Texture: MeshStandardMaterial
    }
}

type ActionName =
    | 'Bite_Front'
    | 'Bite_InPlace'
    | 'Dance'
    | 'Death'
    | 'HitRecieve'
    | 'Idle'
    | 'Jump'
    | 'No'
    | 'Walk'
    | 'Yes'

type GLTFActions = Record<ActionName, AnimationAction>

const lightOrangeIndividualMaterial = new MeshToonMaterial({
    color: hexStringToCode("#630721"),
    skinning: true,
});
lightOrangeIndividualMaterial.color.convertSRGBToLinear();

export default function Demon({isDead, ...props}: JSX.IntrinsicElements['group'] & {
    isDead: boolean,
}) {
    const group = useRef<THREE.Group>()
    const {nodes, materials, animations, scene} = useGLTF('/Demon.glb') as GLTFResult
    const [geometry]: any = useState(() => {
        const clonedScene = SkeletonUtils.clone(scene)
        setMaterials(clonedScene, {
            Texture: lightOrangeIndividualMaterial
        })
        setShadows(clonedScene)
        return clonedScene
    })

    const actions = useRef<GLTFActions>()
    const [mixer] = useState(() => new AnimationMixer(nodes.Demon001))
    useFrame((state, delta) => mixer.update(delta))
    useEffect(() => {
        actions.current = {
            Bite_Front: mixer.clipAction(animations[0], group.current),
            Bite_InPlace: mixer.clipAction(animations[1], group.current),
            Dance: mixer.clipAction(animations[2], group.current),
            Death: mixer.clipAction(animations[3], group.current),
            HitRecieve: mixer.clipAction(animations[4], group.current),
            Idle: mixer.clipAction(animations[5], group.current),
            Jump: mixer.clipAction(animations[6], group.current),
            No: mixer.clipAction(animations[7], group.current),
            Walk: mixer.clipAction(animations[8], group.current),
            Yes: mixer.clipAction(animations[9], group.current),
        }
        actions.current.Death.loop = LoopOnce
        actions.current.Death.clampWhenFinished = true
        return () => animations.forEach((clip) => mixer.uncacheClip(clip))
    }, [])

    useEffect(() => {
        if (!actions.current) return
        let animation = isDead ? actions.current.Death : actions.current.Dance
        if (isDead) {
            actions.current.Dance.stop()
        }
        animation.play()
    }, [isDead])

    return (
        <group ref={group} {...props} dispose={null}>
            <primitive object={geometry} dispose={null} />
        </group>
    )
}

useGLTF.preload('/Demon.glb')
