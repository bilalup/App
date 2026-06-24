import {format} from 'date-fns';
import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import Icon from '@components/Icon';
import Popover from '@components/Popover';
import {PressableWithFeedback} from '@components/Pressable';
import Text from '@components/Text';
import {useCurrencyListActions} from '@hooks/useCurrencyList';
import {useMemoizedLazyExpensifyIcons} from '@hooks/useLazyAsset';
import useLocalize from '@hooks/useLocalize';
import useResponsiveLayout from '@hooks/useResponsiveLayout';
import useTheme from '@hooks/useTheme';
import useThemeStyles from '@hooks/useThemeStyles';
import useWindowDimensions from '@hooks/useWindowDimensions';
import getClickedTargetLocation from '@libs/getClickedTargetLocation';
import variables from '@styles/variables';
import CONST from '@src/CONST';

type WorkspaceCompanyCardsBalanceLabelProps = {
    /** Label type */
    type: 'currentBalance' | 'remainingLimit';

    /** Value in cents, or undefined if not available from the bank */
    value: number | undefined;

    /** Output currency for display */
    currency: string;

    /** Last-updated datetime string from the backend, or undefined */
    lastUpdated: string | undefined;
};

function WorkspaceCompanyCardsBalanceLabel({type, value, currency, lastUpdated}: WorkspaceCompanyCardsBalanceLabelProps) {
    const styles = useThemeStyles();
    const theme = useTheme();
    const {translate, getLocalDateFromDatetime} = useLocalize();
    const {convertToDisplayString} = useCurrencyListActions();
    const {windowWidth} = useWindowDimensions();
    const {shouldUseNarrowLayout} = useResponsiveLayout();
    const icons = useMemoizedLazyExpensifyIcons(['Info']);
    const [isVisible, setVisible] = useState(false);
    const [anchorPosition, setAnchorPosition] = useState({top: 0, left: 0});
    const anchorRef = useRef(null);

    useEffect(() => {
        if (!anchorRef.current || !isVisible) {
            return;
        }

        const position = getClickedTargetLocation(anchorRef.current);
        const BOTTOM_MARGIN_OFFSET = 3;

        setAnchorPosition({
            top: position.top + position.height + BOTTOM_MARGIN_OFFSET,
            left: position.left,
        });
    }, [isVisible, windowWidth]);

    const displayValue = value === undefined ? translate('workspace.companyCards.balance.notAvailable') : convertToDisplayString(value, currency);

    const formattedLastUpdated = lastUpdated ? format(getLocalDateFromDatetime(lastUpdated), CONST.DATE.FNS_DATE_TIME_FORMAT_STRING) : undefined;

    return (
        <View style={styles.mnw120}>
            <View
                ref={anchorRef}
                style={[styles.flexRow, styles.alignItemsCenter, styles.mb1]}
            >
                <Text style={[styles.mutedNormalTextLabel, styles.mr1]}>{translate(`workspace.companyCards.balance.${type}`)}</Text>
                <PressableWithFeedback
                    accessibilityLabel={translate(`workspace.companyCards.balance.${type}`)}
                    accessibilityRole={CONST.ROLE.BUTTON}
                    onPress={() => setVisible(true)}
                    sentryLabel={CONST.SENTRY_LABEL.WORKSPACE_CARDS_LIST.INFO_BUTTON}
                >
                    <Icon
                        src={icons.Info}
                        width={variables.iconSizeExtraSmall}
                        height={variables.iconSizeExtraSmall}
                        fill={theme.icon}
                    />
                </PressableWithFeedback>
            </View>
            <Text style={styles.shortTermsHeadline}>{displayValue}</Text>
            <Popover
                onClose={() => setVisible(false)}
                isVisible={isVisible}
                outerStyle={!shouldUseNarrowLayout ? styles.pr5 : undefined}
                innerContainerStyle={!shouldUseNarrowLayout ? {maxWidth: variables.modalContentMaxWidth} : undefined}
                anchorRef={anchorRef}
                anchorPosition={anchorPosition}
            >
                <View style={styles.p4}>
                    <Text
                        numberOfLines={1}
                        style={[styles.optionDisplayName, styles.textStrong, styles.mb2]}
                    >
                        {translate(`workspace.companyCards.balance.${type}`)}
                    </Text>
                    <Text style={[styles.textLabelSupporting, styles.lh16]}>
                        {formattedLastUpdated
                            ? translate(`workspace.companyCards.balance.${type}Description`, {lastUpdated: formattedLastUpdated})
                            : translate(`workspace.companyCards.balance.${type}DescriptionNoTimestamp`)}
                    </Text>
                </View>
            </Popover>
        </View>
    );
}

export default WorkspaceCompanyCardsBalanceLabel;
