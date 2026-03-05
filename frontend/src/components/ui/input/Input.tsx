import clsx from 'clsx'
import styles from './Input.module.scss'
import { TooltipContainer } from '../tooltip'
import { Sprite } from '../sprite'

type Props = {
	label: string
	placeholder?: string
	type?: string
	error?: string | undefined
	className?: string
	onChange?: (e: any) => void
	onBlur?: (e: any) => void
	autoFocus?: boolean
	tooltip?: string
	value?: string | number | undefined | null
}

export function Input({
	error,
	label,
	placeholder,
	type = 'text',
	className,
	onBlur,
	autoFocus = false,
	tooltip = '',
	value,
	...props
}: Props) {
	return (
		<div className={className}>
			<div className="flex items-center gap-1">
				<span className={styles.label}>{label}</span>
				{tooltip && (
					<TooltipContainer
						trigger={
							<>
								<Sprite
									name="question"
									className="size-4 text-[#FDFDFD]/[40%]"
								/>
							</>
						}
						delay={0}
					>
						<p className="max-w-60 text-center">{tooltip}</p>
					</TooltipContainer>
				)}
			</div>
			<div className={clsx(styles.wrapper, error && styles.error)}>
				<label className="w-full">
					<input
						value={value || ''}
						type={type}
						className={clsx(styles.input, error && styles.inputError)}
						placeholder={placeholder}
						onBlur={onBlur}
						autoFocus={autoFocus}
						{...props}
					/>
				</label>
			</div>
			{error && <p className={styles.error}>{error}</p>}
		</div>
	)
}
