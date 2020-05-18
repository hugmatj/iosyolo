import React, { useContext, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { ThemeContext } from '../../../store/ThemeStore'
import { BRANCH, BUILD_STATE, ARTIFACT_KIND_NAMES } from '../../../constants'

import './Build.scss'
import CardTitle from './CardTitle'
import CardHeader from './CardHeader'
import BuildAndMrContainer from './BuildAndMrContainer'
import { ResultContext } from '../../../store/ResultStore'
import { tagStyle } from '../../styleTools/buttonStyler'
import Tag from '../../Tag/Tag'
import { getArtifactKindIcon } from '../../styleTools/brandIcons'
import { getStrEquNormalized } from '../../../util/getters'

const BuildContainer = ({ build, toCollapse, children }) => {
  const { state } = useContext(ResultContext)
  const [collapsed, toggleCollapsed] = useState(toCollapse)
  const { theme } = useContext(ThemeContext)

  const {
    short_id: buildShortId = '',
    id: buildId = '',
    branch: buildBranch = '',
    state: buildState = '',
    has_mergerequest: buildHasMr = null,
    has_artifacts: buildHasArtifacts = null,
    has_mergerequest: {
      short_id: mrShortId = '',
      id: mrId = '',
      title: mrTitle = '',
      has_author: {
        name: buildAuthorName = '',
        id: buildAuthorId = '',
        avatar_url: buildAuthorAvatarUrl = '',
      } = {},
    } = {},
    allBuilds = [],
  } = build || {}

  const isMaster = getStrEquNormalized(buildBranch, BRANCH.MASTER)

  const cardTitle = (
    <CardTitle
      {...{
        buildHasMr,
        buildId,
        buildShortId,
        isMaster,
        mrId,
        mrShortId,
        mrTitle,
      }}
    />
  )

  const ArtifactKindIcon = ({ color, kind = '' }) => (
    <FontAwesomeIcon
      icon={getArtifactKindIcon(kind)}
      color={color}
      title={`Artifact kind: ${ARTIFACT_KIND_NAMES[kind]}`}
    />
  )

  const FirstBuildArtifactTags = collapsed && buildHasArtifacts && (
    <>
      {buildHasArtifacts.map((a, i) => {
        const { state: artifactState, kind = 'UnknownKind' } = a
        const artifactTagStyle = tagStyle({
          name: theme.name,
          state: artifactState,
        })
        const iconColor = tagStyle.color
        return (
          <Tag
            key={i}
            text={artifactState}
            styles={artifactTagStyle}
            icon={ArtifactKindIcon({ color: iconColor, kind })}
            classes={{ 'btn-state-tag': true }}
            title={`Artifact kind: ${kind}`}
          />
        )
      })}
    </>
  )

  const FirstBuildStatusTag = collapsed && buildState && (
    <Tag
      classes={{ 'btn-state-tag': true }}
      text={buildState}
      styles={tagStyle({
        name: theme.name,
        state: BUILD_STATE[buildState],
      })}
    />
  )

  const otherBuildsMessage = collapsed && allBuilds.length > 1
    ? `${allBuilds.length - 1} other build${
      allBuilds.length - 1 > 1 ? 's' : ''
    }`
    : ''

  const BuildCountTag = collapsed && otherBuildsMessage && (
    <Tag
      classes={{ 'btn-info-tag': true }}
      styles={tagStyle({ name: theme.name, state: null })}
      text={otherBuildsMessage}
    />
  )

  const cardStateTags = collapsed && (
    <>
      {FirstBuildStatusTag}
      {FirstBuildArtifactTags}
      {BuildCountTag}
    </>
  )

  return (
    <div className="Build" id={buildId}>
      {children}
      <div
        className="card"
        style={{
          backgroundColor: theme.bg.block,
          boxShadow: theme.shadowStyle.block,
        }}
        key={buildId}
      >
        <CardHeader
          {...{
            buildAuthorAvatarUrl,
            buildAuthorId,
            buildAuthorName,
            buildHasMr,
            buildId,
            buildShortId,
            collapsed,
            isMaster,
            mrId,
            mrShortId,
            toggleCollapsed,
            cardTitle,
            cardStateTags,
          }}
        />
        {!collapsed
          && allBuilds.map((b, i) => (
            <BuildAndMrContainer
              {...{
                build: state.builds[b],
                mr: buildHasMr,
                isDetailed: i === 0,
                isMaster,
              }}
              key={i}
            />
          ))}
      </div>
    </div>
  )
}

export default BuildContainer